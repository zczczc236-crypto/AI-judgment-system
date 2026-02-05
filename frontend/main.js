let lang = "ko";
const i18n = {
  ko: {
    login: "로그인",
    signup: "회원가입",
    upload: "판별하기",
    history: "히스토리",
    email: "이메일",
    password: "비밀번호"
  },
  en: {
    login: "Login",
    signup: "Sign up",
    upload: "Detect",
    history: "History",
    email: "Email",
    password: "Password"
  }
};

function setLang(l) {
  lang = l;
  document.getElementById("auth-title").innerText = i18n[lang].login;
  document.querySelector("#email").placeholder = i18n[lang].email;
  document.querySelector("#password").placeholder = i18n[lang].password;
  document.querySelector("#auth button:nth-child(3)").innerText = i18n[lang].login;
  document.querySelector("#auth button:nth-child(4)").innerText = i18n[lang].signup;
  document.querySelector("#upload-section button").innerText = i18n[lang].upload;
  document.querySelector("#upload-section button:nth-child(2)").innerText = i18n[lang].history;
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    document.getElementById("auth").style.display = "none";
    document.getElementById("upload-section").style.display = "block";
  } else {
    alert(data.error);
  }
}

async function uploadImage() {
  const file = document.getElementById("file").files[0];
  if (!file) return alert("파일 선택");

  const form = new FormData();
  form.append("file", file);

  const token = localStorage.getItem("token");

  const res = await fetch("/api/predict", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: form
  });

  const data = await res.json();
  alert(data.result || data.error);
}

async function showHistory() {
  const token = localStorage.getItem("token");
  const res = await fetch("/api/history", {
    headers: { Authorization: "Bearer " + token }
  });
  const data = await res.json();
  const list = document.getElementById("history-list");
  list.innerHTML = "";
  data.forEach(h => {
    const li = document.createElement("li");
    li.innerText = `${h.result} - ${h.created_at}`;
    list.appendChild(li);
  });
  document.getElementById("history-section").style.display = "block";
}
