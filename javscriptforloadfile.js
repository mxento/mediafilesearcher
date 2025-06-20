// ... (HTML structure and CSS remain the same)
// javascript snippet to load the file and handle search functionality
<script>
    let fileData = null;

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const fileStatusSpan = document.getElementById('fileStatus'); // Added to display loading status

    // Function to perform the search (same as before)
    function performSearch() {
        if (fileData === null) {
            resultsDiv.innerHTML = '<p class="text-red-500 text-center">Error: Data not loaded. Please refresh or check server.</p>';
            return;
        }

        const query = searchInput.value.toLowerCase().trim();
        resultsDiv.innerHTML = '';

        if (query === '') {
            resultsDiv.innerHTML = '<p class="text-gray-500 text-center">Enter a search term and click \'Search\' to see results.</p>';
            return;
        }

        const lines = fileData.split('\n');
        const foundResults = [];

        for (const line of lines) {
            if (line.toLowerCase().includes(query)) {
                foundResults.push(line.trim());
            }
        }

        if (foundResults.length > 0) {
            foundResults.forEach(result => {
                const p = document.createElement('p');
                p.classList.add('result-item');
                p.textContent = result;
                resultsDiv.appendChild(p);
            });
            resultsDiv.scrollTop = 0;
        } else {
            resultsDiv.innerHTML = `<p class="text-gray-500 text-center">No results found for "${query}".</p>`;
        }
    }

    // Function to load the data file using Fetch API
    async function loadDataFile() {
        try {
            fileStatusSpan.textContent = 'Loading datafile.txt...';
            const response = await fetch('datafile.txt'); // Fetch the file
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fileData = await response.text(); // Get the text content
            fileStatusSpan.textContent = 'datafile.txt loaded successfully.';
            searchInput.disabled = false;
            searchButton.disabled = false;
            resultsDiv.innerHTML = '<p class="text-gray-500 text-center">File loaded. Enter a search term and click \'Search\'.</p>';
        } catch (error) {
            console.error('Error loading data file:', error);
            fileStatusSpan.textContent = 'Error loading datafile.txt. Check console.';
            resultsDiv.innerHTML = '<p class="text-red-500 text-center">Could not load `datafile.txt`. Ensure it\'s in the same directory and server is running.</p>';
            searchInput.disabled = true;
            searchButton.disabled = true;
            fileData = null;
        }
    }

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Load data file automatically when the page loads
    window.onload = () => {
        searchInput.disabled = true;
        searchButton.disabled = true;
        resultsDiv.innerHTML = '<p class="text-gray-500 text-center">Attempting to load `datafile.txt`...</p>';
        loadDataFile(); // Trigger load on page load
    };
</script>