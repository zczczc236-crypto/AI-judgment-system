async function upload() {
  const file = document.getElementById("file").files[0];
  if (!file) return alert("파일 선택");

  const form = new FormData();
  form.append("file", file);

  const token = localStorage.getItem("token");

  const res = await fetch("/api/predict", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token
    },
    body: form
  });

  const data = await res.json();
  alert(data.result || data.error);
}
