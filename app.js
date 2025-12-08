// Firebase imports (CDN version for GitHub Pages)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInAnonymously, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// ✅ Your Firebase config (corrected)
const firebaseConfig = {
  apiKey: "AIzaSyAS9_VXqbnxsnKWmb8npOZp5tA3yclkf-o",
  authDomain: "teach-ad928.firebaseapp.com",
  projectId: "teach-ad928",
  storageBucket: "teach-ad928.appspot.com", // fixed
  messagingSenderId: "149298423922",
  appId: "1:149298423922:web:110997093762458d3cfaeb",
  measurementId: "G-V3YMBEHJLG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ---------------- LOGIN ----------------
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    document.getElementById("loginMsg").textContent = "Login failed: " + err.message;
  }
});

document.getElementById("guestLogin")?.addEventListener("click", async () => {
  await signInAnonymously(auth);
  window.location.href = "dashboard.html";
});

// ---------------- DASHBOARD ----------------
const teacherList = document.getElementById("teacherList");
const addForm = document.getElementById("addTeacherForm");
const userInfo = document.getElementById("userInfo");

onAuthStateChanged(auth, (user) => {
  if (!teacherList) return; // only run on dashboard
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const isGuest = user.isAnonymous;
  userInfo.textContent = isGuest ? "Guest (view only)" : `User: ${user.email}`;

  if (!isGuest) addForm.classList.remove("hidden");

  // Real-time Firestore sync
  onSnapshot(collection(db, "teachers"), (snapshot) => {
    teacherList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const t = docSnap.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h3>${t.name}</h3><p>Status: ${t.status}</p>`;

      if (!isGuest) {
        const select = document.createElement("select");
        ["Present","Absent","Late","Unavailable"].forEach(opt => {
          const o = document.createElement("option");
          o.value = opt;
          o.textContent = opt;
          if (opt === t.status) o.selected = true;
          select.appendChild(o);
        });
        div.appendChild(select);

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.onclick = async () => {
          await updateDoc(doc(db, "teachers", docSnap.id), { status: select.value });
        };
        div.appendChild(saveBtn);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = async () => {
          await deleteDoc(doc(db, "teachers", docSnap.id));
        };
        div.appendChild(delBtn);
      }

      teacherList.appendChild(div);
    });
  });
});

// Add teacher
document.getElementById("addTeacher")?.addEventListener("click", async () => {
  const name = document.getElementById("newName").value;
  const status = document.getElementById("newStatus").value;
  if (name.trim() === "") return;
  await addDoc(collection(db, "teachers"), { name, status });
});

// Logout
document.getElementById("logout")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});