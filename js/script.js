let packages = JSON.parse(localStorage.getItem("trackProPackages")) || [
    {
        id: "TRK10001",
        customer: "Ananya",
        location: "Chennai",
        status: "In Transit",
        delivery: "22 September 2026"
    },
    {
        id: "TRK10002",
        customer: "Rahul",
        location: "Kochi",
        status: "Delivered",
        delivery: "18 September 2026"
    },
    {
        id: "TRK10003",
        customer: "Priya",
        location: "Bangalore",
        status: "Pending",
        delivery: "24 September 2026"
    },
    {
        id: "TRK10004",
        customer: "Arun",
        location: "Coimbatore",
        status: "Out for Delivery",
        delivery: "21 September 2026"
    }
];

function trackPackage() {

    const input = document.getElementById("trackingInput").value.trim();
    const result = document.getElementById("trackingResult");

    const pkg = packages.find(
        item => item.id.toLowerCase() === input.toLowerCase()
    );

    if (pkg) {

        result.innerHTML = `
            <h3>Tracking ID: ${pkg.id}</h3>
            <p><strong>Customer:</strong> ${pkg.customer}</p>
            <p><strong>Current Location:</strong> ${pkg.location}</p>
            <p>
    <strong>Status:</strong>
    <span class="status ${pkg.status === "Delivered" ? "delivered" : pkg.status === "Pending" ? "pending" : pkg.status === "Out for Delivery" ? "out" : "transit"}">
        ${pkg.status}
    </span>
</p>
            <p><strong>Estimated Delivery:</strong> ${pkg.delivery}</p>

            <hr style="margin:20px 0;">

            <h3>Delivery Timeline</h3>
            <p>📦 Order Received ✓</p>
            <p>🔄 Package In Transit ✓</p>
            <p>📍 Current Location: ${pkg.location}</p>
            <p>🚚 Out for Delivery</p>
            <p>✅ Delivered</p>
        `;

    } else {

        result.innerHTML = `
            <p style="color:red;">
                ❌ Tracking ID not found.
            </p>
            <p>Try: <strong>TRK10001</strong></p>
        `;
    }
}
function displayPackages() {

    const table = document.getElementById("packageTable");

    if (!table) return;

    table.innerHTML = "";

    packages.forEach((pkg, index) => {

        table.innerHTML += `
            <tr>
                <td>${pkg.id}</td>
                <td>${pkg.customer}</td>
                <td>${pkg.location}</td>
                <td>${pkg.status}</td>

                <td>
                    <button onclick="editPackage(${index})"
                        style="background:#f59e0b;color:white;border:none;padding:7px 12px;border-radius:5px;cursor:pointer;">
                        Edit
                    </button>

                    <button onclick="deletePackage(${index})"
                        style="background:#ef4444;color:white;border:none;padding:7px 12px;border-radius:5px;cursor:pointer;">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


function addPackage() {

    const id = document.getElementById("packageId").value.trim();
    const customer = document.getElementById("customerName").value.trim();
    const location = document.getElementById("packageLocation").value.trim();
    const status = document.getElementById("packageStatus").value;

    if (!id || !customer || !location) {
        alert("Please fill all fields");
        return;
    }

    packages.push({
        id: id,
        customer: customer,
        location: location,
        status: status,
        delivery: "To be updated"
    });

    document.getElementById("packageId").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("packageLocation").value = "";

    displayPackages();
    updateDashboard();
    savePackages();

    alert("Package added successfully!");
}


function deletePackage(index) {

    packages.splice(index, 1);

    displayPackages();
    updateDashboard();
    savePackages();

    alert("Package deleted!");
}
function updateDashboard() {

    const total = packages.length;

    const transit = packages.filter(
        pkg => pkg.status === "In Transit"
    ).length;

    const delivered = packages.filter(
        pkg => pkg.status === "Delivered"
    ).length;

    const totalElement = document.getElementById("totalPackages");
    const transitElement = document.getElementById("inTransit");
    const deliveredElement = document.getElementById("delivered");

    if (totalElement) {
        totalElement.textContent = total;
    }

    if (transitElement) {
        transitElement.textContent = transit;
    }

    if (deliveredElement) {
        deliveredElement.textContent = delivered;
    }
}

updateDashboard();
function searchPackages() {

    const search = document
        .getElementById("packageSearch")
        .value
        .toLowerCase();

    const rows = document.querySelectorAll("#packageTable tr");

    rows.forEach(row => {

        const text = row.textContent.toLowerCase();

        row.style.display =
            text.includes(search) ? "" : "none";
    });
}


function editPackage(index) {
    const pkg = packages[index];

    const newStatus = prompt(
        "Enter new status:\nPending\nIn Transit\nOut for Delivery\nDelivered\nFailed",
        pkg.status
    );

    if (newStatus) {
        pkg.status = newStatus;

        displayPackages();
        updateDashboard();
        savePackages();

        alert("✅ Package updated!");
    }
}
function savePackages() {
    localStorage.setItem("trackProPackages", JSON.stringify(packages));
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "on");
    } else {
        localStorage.setItem("darkMode", "off");
    }
}

if (localStorage.getItem("darkMode") === "on") {
    document.body.classList.add("dark-mode");
}
function logoutUser() {
    localStorage.removeItem("trackProLoggedIn");
    alert("✅ Logged out successfully!");
    window.location.href = "login.html";
}
function exportCSV() {
    let csv = "Tracking ID,Customer,Location,Status\n";

    packages.forEach(pkg => {
        csv += `${pkg.id},${pkg.customer},${pkg.location},${pkg.status}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "TrackPro_Report.csv";
    link.click();

    URL.revokeObjectURL(url);

    alert("✅ CSV report downloaded!");
}
