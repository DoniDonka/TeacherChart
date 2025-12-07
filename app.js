// Demo user database
const users = {
  "Doni": "1234", // username:password
  "Admin": "adminpass"
};

let currentUser = null;
let teachers = [
  { name: "Mrs Johnson", status: "Absent" },
  { name: "Mr Lee", status: "Present" }
];

// Login form
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("loginMsg");

  if (users[username] && users[username] === password) {
    currentUser = { name: username, guest: false };
    msg.textContent = `Username: ${username}\nPassword: ${password}\nWelcome back ${username}`;
    msg.classList.add("fadeIn");
    setTimeout(() => window.location.href = "dashboard.html", 1500);
  } else {
    msg.textContent = "Invalid login";
  }
});

// Guest login
document.getElementById("guestLogin")?.addEventListener("click", () => {
  currentUser = { name: "Guest", guest: true };
  document.getElementById("loginMsg").textContent = "Welcome Guest (view only)";
  setTimeout(() => window.location.href = "dashboard.html", 1000);
});

// Dashboard logic
const teacherList = document.getElementById("teacherList");
const addForm = document.getElementById("addTeacherForm");
const userInfo = document.getElementById("userInfo");

if (teacherList) {
  userInfo.textContent = currentUser?.guest ? "Guest (view only)" : `User: ${currentUser?.name}`;
  if (!currentUser?.guest) addForm.classList.remove("hidden");

  const tpl = document.getElementById("teacherCardTpl");
  teachers.forEach((t, idx) => {
    const node = tpl.content.cloneNode(true);
    node.querySelector(".name").textContent = t.name;
    const statusEl = node.querySelector(".status");
    statusEl.value = t.status;
    const saveBtn = node.querySelector(".save");
    const deleteBtn = node.querySelector(".delete");

    if (currentUser?.guest) {
      statusEl.disabled = true;
      saveBtn.style.display = "none";
      deleteBtn.style.display = "none";
    } else {
      saveBtn.addEventListener("click", () => {
        teachers[idx].status = statusEl.value;
        alert(`${t.name} updated to ${statusEl.value}`);
      });
      deleteBtn.addEventListener("click", () => {
        teachers.splice(idx, 1);
        alert(`${t.name} deleted`);
        window.location.reload();
      });
    }
    teacherList.appendChild(node);
  });

  document.getElementById("addTeacher")?.addEventListener("click", () => {
    const name = document.getElementById("newName").value;
    const status = document.getElementById("newStatus").value;
    teachers.push({ name, status });
    alert(`${name} added`);
    window.location.reload();
  });
}

document.getElementById("logout")?.addEventListener("click", () => {
  currentUser = null;
  window.location.href = "index.html";
});