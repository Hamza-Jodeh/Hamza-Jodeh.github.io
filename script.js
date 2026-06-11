function startWebsite() {
  checkVisit();
  startClocks();
  loadJoke();
  loadDog();

  setInterval(loadJoke, 60000);
}

function startClocks() {
  updateDigitalClock();
  drawAnalogClock();

  setInterval(updateDigitalClock, 1000);
  setInterval(drawAnalogClock, 1000);
}

function updateDigitalClock() {
  document.getElementById("digitalClock").innerHTML =
    moment().format("dddd, MMMM Do YYYY, h:mm:ss A");
}

function drawAnalogClock() {
  const canvas = document.getElementById("analogClock");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const radius = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);

  ctx.beginPath();
  ctx.arc(0, 0, radius - 8, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.stroke();

  for (let num = 1; num <= 12; num++) {
    let ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.78);
    ctx.rotate(-ang);
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.78);
    ctx.rotate(-ang);
  }

  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  hour = hour % 12;
  hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60));
  drawHand(ctx, hour, radius * 0.45, 6);

  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(ctx, minute, radius * 0.65, 4);

  second = second * Math.PI / 30;
  drawHand(ctx, second, radius * 0.75, 2);

  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "black";
  ctx.fill();

  ctx.restore();
}

function drawHand(ctx, position, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(position);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-position);
}

function toggleEmail() {
  $("#email").toggle();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function loadJoke() {
  $.get("https://v2.jokeapi.dev/joke/Any", function(data) {
    if (data.type === "single") {
      $("#joke").text(data.joke);
    } else {
      $("#joke").text(data.setup + " " + data.delivery);
    }
  }).fail(function() {
    $("#joke").text("Unable to load joke right now.");
  });
}

function loadDog() {
  fetch("https://dog.ceo/api/breeds/image/random")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      document.getElementById("dogImage").src = data.message;
    })
    .catch(function(error) {
      console.log("Dog API error:", error);
    });
}

function checkVisit() {
  let lastVisit = getCookie("lastVisit");
  let currentVisit = new Date().toString();

  if (lastVisit === "") {
    document.getElementById("visitMessage").innerHTML =
      "Welcome to my homepage for the first time!";
  } else {
    document.getElementById("visitMessage").innerHTML =
      "Welcome back! Your last visit was " + lastVisit;
  }

  setCookie("lastVisit", currentVisit, 365);
}

function setCookie(name, value, days) {
  let date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

  let expires = "expires=" + date.toUTCString();

  document.cookie =
    name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
  let cookieName = name + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();

    if (c.indexOf(cookieName) === 0) {
      return c.substring(cookieName.length, c.length);
    }
  }

  return "";
}
