async function loadJobs() {
    try {
        const res = await fetch('/savedJobs');
        const jobs = await res.json();

        const container = document.getElementById('jobsList');
        container.innerHTML = '';

        const table = document.createElement('table');

        const header = document.createElement('tr');
        header.innerHTML = `
            <th>Email</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Domain</th>
            <th>Description</th>
            <th>Flags</th>
        `;
        table.appendChild(header);

        let paymentCount = 0;
        let urgentCount = 0;
        let remoteCount = 0;
        let addressCount = 0;
        let websiteCount = 0;

        jobs.forEach(post => {

            const flags = post.flagged || '';

            if (/payment/i.test(flags)) paymentCount++;
            else if (/urgent/i.test(flags)) urgentCount++;
            else if (/remote/i.test(flags)) remoteCount++;
            else if (/address/i.test(flags)) addressCount++;
            else if (/website/i.test(flags)) websiteCount++;

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${post.userEmail || ''}</td>
                <td>${post.jobTitle || ''}</td>
                <td>${post.companyName || ''}</td>
                <td>${post.companyDomain || ''}</td>
                <td>${post.jobDesc || ''}</td>
                <td>${post.flagged || ''}</td>
            `;

            table.appendChild(row);
        });

        container.appendChild(table);

        const ctx = document.getElementById('flagChart');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Payment Mentioned',
                    'Urgent Mentioned',
                    'Remote Work',
                    'Suspicious Address',
                    'Applying Using Third-Party'
                ],
                datasets: [{
                    label: 'Flag Frequency',
                    data: [
                        paymentCount,
                        urgentCount,
                        remoteCount,
                        addressCount,
                        websiteCount
                    ],
                    backgroundColor: [
                        'hotpink'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

    } catch (e) {
        console.log(e);
    }
}

loadJobs();