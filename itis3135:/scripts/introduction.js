// introduction.js
// Handles the Introduction Form: validation, reset, dynamic course fields,
// image upload/default, and rendering the submitted result in place of the form.

document.addEventListener("DOMContentLoaded", function () {

  const formElement = document.getElementById("introForm");
  const mainElement = document.querySelector("main");
  const coursesContainer = document.getElementById("coursesContainer");
  const addCourseBtn = document.getElementById("addCourseBtn");
  const clearBtn = document.getElementById("clearBtn");
  const pictureInput = document.getElementById("picture");
  const defaultImageSrc = "images/bark-in-the-park-emametz.jpg";

  let courseCount = document.querySelectorAll(".course-entry").length;

  // Prevent default form submission (no page refresh)
  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formElement.checkValidity()) {
      renderResult();
    } else {
      formElement.reportValidity();
    }
  });

  // Add new course entry
  addCourseBtn.addEventListener("click", function () {
    courseCount++;
    const courseDiv = document.createElement("div");
    courseDiv.className = "course-entry";
    courseDiv.innerHTML = `
      <input type="text" name="courseDept${courseCount}" placeholder="Department (e.g. ITIS)" required>
      <input type="text" name="courseNum${courseCount}" placeholder="Number (e.g. 3135)" required>
      <input type="text" name="courseName${courseCount}" placeholder="Course Name" required>
      <input type="text" name="courseReason${courseCount}" placeholder="Reason" required>
      <button type="button" class="removeCourseBtn">Remove</button>
    `;
    coursesContainer.appendChild(courseDiv);
  });

  // Remove a course entry (event delegation, since new ones are added dynamically)
  coursesContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("removeCourseBtn")) {
      e.target.closest(".course-entry").remove();
    }
  });

  // Clear button: empty all fields (but keep defaults like the image working as expected)
  clearBtn.addEventListener("click", function () {
    Array.from(formElement.querySelectorAll("input[type='text'], input[type='date'], textarea")).forEach((input) => {
      input.value = "";
    });
    pictureInput.value = "";
  });

  // Renders the submitted data in place of the form, matching the Introduction page layout
  function renderResult() {
    const data = new FormData(formElement);

    const firstName = data.get("firstName") || "";
    const middleName = data.get("middleName") || "";
    const nickname = data.get("nickname") || "";
    const lastName = data.get("lastName") || "";
    const ackStatement = data.get("ackStatement") || "";
    const ackDate = data.get("ackDate") || "";
    const mascotAdjective = data.get("mascotAdjective") || "";
    const mascotAnimal = data.get("mascotAnimal") || "";
    const divider = data.get("divider") || "|";
    const pictureCaption = data.get("pictureCaption") || "";
    const personalStatement = data.get("personalStatement") || "";

    const bulletLabels = [
      "Personal Background",
      "Professional Background",
      "Academic Background",
      "Background in this Subject",
      "Primary Work Computer",
      "Backup Work Computer & Location Plan"
    ];
    const bullets = bulletLabels.map((label, i) => {
      const val = data.get("bullet" + (i + 1)) || "";
      return `<li><strong>${label}:</strong> ${val}</li>`;
    }).join("");

    // Courses
    const courseEntries = document.querySelectorAll(".course-entry");
    let coursesHTML = "";
    courseEntries.forEach((entry) => {
      const inputs = entry.querySelectorAll("input");
      const dept = inputs[0].value;
      const num = inputs[1].value;
      const name = inputs[2].value;
      const reason = inputs[3].value;
      coursesHTML += `<li>${dept} ${num} ${name} - ${reason}</li>`;
    });

    const funnyThing = data.get("funnyThing") || "";
    const shareThing = data.get("shareThing") || "";
    const quote = data.get("quote") || "";
    const quoteAuthor = data.get("quoteAuthor") || "";

    const links = [1, 2, 3, 4, 5].map((i) => {
      const label = data.get("linkLabel" + i);
      const url = data.get("linkUrl" + i);
      if (label && url) {
        return `<a href="${url}" target="_blank">${label}</a>`;
      }
      return "";
    }).filter(Boolean).join(" | ");

    // Image: use uploaded file if provided, otherwise default
    let imageSrc = defaultImageSrc;
    const file = pictureInput.files[0];

    const buildResultHTML = (imgSrc) => {
      mainElement.innerHTML = `
        <h2>Introduction Form</h2>

        <p>${lastName}, ${firstName}${middleName ? " " + middleName : ""}${nickname ? " \"" + nickname + "\"" : ""}</p>
        <p>${ackStatement} - ${firstName.charAt(0)}${lastName.charAt(0)} - ${ackDate}</p>

        <h3>${firstName} ${lastName} ${divider} ${mascotAdjective} ${mascotAnimal}</h3>

        <figure>
          <img src="${imgSrc}" alt="${pictureCaption}" width="500">
          <figcaption>${pictureCaption}</figcaption>
        </figure>

        <p>${personalStatement}</p>

        <ul>
          ${bullets}
          <li><strong>Courses I'm Taking, &amp; Why:</strong>
            <ul>${coursesHTML}</ul>
          </li>
        </ul>

        <p><strong>Funny/Interesting item to remember me by:</strong> ${funnyThing}</p>
        <p><strong>I'd also like to share:</strong> ${shareThing}</p>

        <p>${divider}</p>

        <blockquote>
          <p>"${quote}"</p>
          <p>- ${quoteAuthor}</p>
        </blockquote>

        <p>${links}</p>

        <p><a href="#" id="resetLink">Reset Form</a></p>
      `;

      document.getElementById("resetLink").addEventListener("click", function (e) {
        e.preventDefault();
        location.reload();
      });
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        buildResultHTML(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      buildResultHTML(imageSrc);
    }
  }
});