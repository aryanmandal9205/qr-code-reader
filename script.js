// Select the necessary DOM elements
const wrapper = document.querySelector(".wrapper"),
      form = document.querySelector("form"),
      fileInp = form.querySelector("input"),
      infoText = form.querySelector("p"),
      closeBtn = document.querySelector(".close"),
      copyBtn = document.querySelector(".copy");

// Function to handle the API request and QR code scanning
function fetchRequest(file, formData) {
    infoText.innerText = "Scanning QR Code..."; // Update the info text while scanning

    // Make a POST request to the QR code scanning API
    fetch("https://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST',
        body: formData
    })
    .then(res => res.json()) // Parse the JSON response
    .then(result => {
        const data = result[0].symbol[0].data; // Get the scanned data
        infoText.innerText = data ? "Upload QR Code to Scan" : "Couldn't scan QR Code"; // Update info text

        if (!data) return; // If no data, exit the function

        // Set the scanned data in the textarea and display the uploaded image
        document.querySelector("textarea").textContent = data; // Use textContent for security
        form.querySelector("img").src = URL.createObjectURL(file); // Create a temporary URL for the uploaded image
        wrapper.classList.add("active"); // Activate the wrapper to show details

        // Trigger confetti animation after image upload (assuming confetti function is defined)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        
    })
    .catch((error) => {
        console.error("Error scanning QR Code:", error); // Log the error for debugging
        infoText.innerText = "Couldn't scan QR Code due to an error."; // Update info text
    });
}

// Event listener for file input change
fileInp.addEventListener("change", async e => {
    let file = e.target.files[0]; // Get the selected file
    if (!file) return; // If no file selected, exit

    // Validate file type to ensure only images are uploaded
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        infoText.innerText = "Please upload a valid image file."; // Inform user of invalid file type
        return; // Exit if the file type is invalid
    }

    let formData = new FormData(); // Create a FormData object to hold the file
    formData.append('file', file); // Append the file to the FormData
    fetchRequest(file, formData); // Call the fetchRequest function
});

// Event listener for copy button to copy text to clipboard
copyBtn.addEventListener("click", () => {
    let text = document.querySelector("textarea").textContent; // Get the text from the textarea
    navigator.clipboard.writeText(text); // Copy the text to clipboard
});

// Event listener for form click to trigger file input click
form.addEventListener("click", () => fileInp.click()); // Trigger file input click when form is clicked

// Event listener for close button to deactivate the wrapper
closeBtn.addEventListener("click", () => wrapper.classList.remove("active")); // Remove active class from wrapper
