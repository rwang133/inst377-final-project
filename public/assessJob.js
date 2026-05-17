async function processForm() {
    const query = document.forms['jobDetailsForm']['companyName'].value.replace(" ", "+");
    const email = document.forms['jobDetailsForm']['userEmail'].value;
    const jobTitle = document.forms['jobDetailsForm']['jobTitle'].value;
    const desc = document.forms['jobDetailsForm']['jobDesc'].value;
    const q1 = document.forms['jobDetailsForm']['q1'].value;
    const q2 = document.forms['jobDetailsForm']['q2'].value;

    const response = await fetch(
        `/assessJob?q=${query}`
    );

    const data = await response.json();

    console.log(data);

    const container = document.getElementById("logoResults");

    const instr = document.createElement("p");
    instr.textContent = `Here are the results for "${query.replace("+", " ")}." Please click on the best match.`;
    
    container.append(instr);

    data.forEach((brand, index) => {

        const button = document.createElement("button");
        button.className = "logoButton";

        const logo = document.createElement("img");
        logo.src = brand.logo_url;
        logo.alt = `${brand.name} logo`;
        logo.className = "logoImage";
        logo.style.borderRadius = "1rem";

        const textContainer = document.createElement("div");
        textContainer.className = "logoText";

        const name = document.createElement("div");
        name.className = "companyName";
        name.textContent = "Company Name: " + brand.name;

        const domain = document.createElement("div");
        domain.className = "companyDomain";
        domain.textContent = "Domain: " + brand.domain;

        button.style.textAlign = "left";

        name.style.textAlign = "left";
        name.style.fontFamily = "monospace";
        name.style.overflowWrap = "break-word";

        domain.style.textAlign = "left";
        domain.style.fontFamily = "monospace";
        domain.style.overflowWrap = "break-word";

        textContainer.appendChild(name);
        textContainer.appendChild(domain);

        button.addEventListener("click", () => {
            getResults(email, jobTitle, brand.name, brand.domain, brand.logo_url, desc, q1, q2);
        });

        button.appendChild(logo);
        button.appendChild(textContainer);

        container.appendChild(button);
    });

    container.appendChild(document.createElement("br"));
    const notFoundButton = document.createElement("button");
    notFoundButton.textContent = "I can't find it.";

    notFoundButton.addEventListener("click", () => {
        getResults(email, jobTitle, null, null, null, desc, q1, q2);
    });

    document.getElementById("jobDetailsForm").style.display = "none";
    document.getElementById("logoResults").style.display = "block";

    container.append(notFoundButton);
}

function getResults(email, jobTitle, name, domain, url, desc, q1, q2) {
    document.getElementById("logoResults").style.display = "none";
    const container = document.getElementById("scanResults");

    const compName = document.createElement("p");
    compName.textContent = "Company Name: " + name;

    const compDomain = document.createElement("p");
    compDomain.textContent = "Company Domain: " + domain;

    const compLogoLabel = document.createElement("p");
    compLogoLabel.textContent = "Company Logo: ";

    const compLogo = document.createElement("img");
    compLogo.src = url;
    compLogo.alt = `${name} logo`;
    compLogo.className = "logoImage";
    compLogo.style.width = "5%";

    container.append(compName);
    container.append(compDomain);
    container.append(compLogoLabel);
    container.append(compLogo);

    const flagged = [];

    if (!(q1 === "yes")) {
        flagged.push("The link to the application is not/may not be from the company's website.");
    }

    if (!(q1 === "no")) {
        flagged.push("The company address is unknown or located in a shared building.");
    }

    if (/payments?/i.test(desc)) {
        flagged.push("Payment was mentioned.");
    }

    if (/urgent/i.test(desc)) {
        flagged.push("Urgent was mentioned.");
    }

    if (/remote/i.test(desc)) {
        flagged.push("Remote work was mentioned.");
    }

    const flaggedDiv = document.getElementById("flagged");

    flagged.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = item;

        flaggedDiv.appendChild(div);
    });

    container.style.display = "block";
    flaggedDiv.style.display = "block";

    if (email !== "") {
        addPost(email, jobTitle, name, domain, url, desc, flagged);
    }
}

async function addPost (userEmail, jobTitle, companyName, companyDomain, logoURL, jobDesc, flagged) {
    try {

    await fetch('/savedJobs', {
    method: 'POST',
    body: JSON.stringify({
      userEmail,
      jobTitle,
      companyName,
      companyDomain,
      logoURL,
      jobDesc,
      flagged
    }),
    headers: {
      'content-type': 'application/json',
    },
  }).then((result) => result.json());

} catch (e) {
    console.log(e);
}
}