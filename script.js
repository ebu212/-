document.addEventListener('DOMContentLoaded', function () {
    const studentForm = document.getElementById('studentForm');
    const studentNameInput = document.getElementById('studentName');
    const attendanceTableBody = document.getElementById('attendanceTable').getElementsByTagName('tbody')[0];
    const totalStudentsDisplay = document.getElementById('totalStudents');
    const totalDaysDisplay = document.getElementById('totalDays');
    const generateReportButton = document.getElementById('generateReport');
    const reportModal = document.getElementById('reportModal');
    const reportTableBody = document.getElementById('monthlyReportTable').getElementsByTagName('tbody')[0];
    const closeModalButton = document.querySelector('.close');
    let totalStudents = 0;
    let totalDays = 0;
    const attendanceData = [];
    const currentDate = new Date().toLocaleDateString();

    studentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const studentName = studentNameInput.value.trim();
        if (studentName !== '') {
            addStudentToTable(studentName);
            studentNameInput.value = '';
        }
    });

    function addStudentToTable(studentName) {
        const row = attendanceTableBody.insertRow();
        const nameCell = row.insertCell(0);
        const attendanceCell = row.insertCell(1);
        const actionsCell = row.insertCell(2);

        nameCell.textContent = studentName;

        const presentButton = document.createElement('button');
        presentButton.textContent = 'Present';
        presentButton.className = 'present';
        presentButton.onclick = function () {
            markAttendance(row, 'present');
        };

        const absentButton = document.createElement('button');
        absentButton.textContent = 'Absent';
        absentButton.className = 'absent';
        absentButton.onclick = function () {
            markAttendance(row, 'absent');
        };

        const excusedButton = document.createElement('button');
        excusedButton.textContent = 'Excused';
        excusedButton.className = 'excused';
        excusedButton.onclick = function () {
            markAttendance(row, 'excused');
        };

        actionsCell.appendChild(presentButton);
        actionsCell.appendChild(absentButton);
        actionsCell.appendChild(excusedButton);

        attendanceData.push({ name: studentName, attendance: 'none', date: currentDate });
        updateSummary();
    }

    function markAttendance(row, status) {
        const studentName = row.cells[0].textContent;
        const attendanceEntry = attendanceData.find(entry => entry.name === studentName && entry.date === currentDate);
        if (attendanceEntry) {
            attendanceEntry.attendance = status;
        }
        row.cells[1].textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }

    function updateSummary() {
        totalStudents = attendanceData.length;
        totalStudentsDisplay.textContent = totalStudents;

        const uniqueDates = new Set(attendanceData.map(entry => entry.date));
        totalDays = uniqueDates.size;
        totalDaysDisplay.textContent = totalDays;
    }

    generateReportButton.addEventListener('click', function () {
        generateMonthlyReport();
        reportModal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', function () {
        reportModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === reportModal) {
            reportModal.style.display = 'none';
        }
    });

    function generateMonthlyReport() {
        reportTableBody.innerHTML = ''; // Clear previous report

        const dateGroups = {};
        attendanceData.forEach(entry => {
            if (!dateGroups[entry.date]) {
                dateGroups[entry.date] = { present: 0, absent: 0, excused: 0, total: 0 };
            }
            dateGroups[entry.date][entry.attendance]++;
            dateGroups[entry.date].total++;
        });

        for (const date in dateGroups) {
            const row = reportTableBody.insertRow();
            const dateCell = row.insertCell(0);
            const presentCell = row.insertCell(1);
            const absentCell = row.insertCell(2);
            const excusedCell = row.insertCell(3);
            const totalCell = row.insertCell(4);

            dateCell.textContent = date;
            presentCell.textContent = dateGroups[date].present;
            absentCell.textContent = dateGroups[date].absent;
            excusedCell.textContent = dateGroups[date].excused;
            totalCell.textContent = dateGroups[date].total;
        }
    }
});
