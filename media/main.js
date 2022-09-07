const vscode = acquireVsCodeApi();

function handle_submit() {
    const file_to_fetch = document.getElementById("file_to_fetch").value;
    
    // Fetch the file path provided by the user
    fetch("https://file+.vscode-resource.vscode-cdn.net" + file_to_fetch)
        .then((res) => res.text())
        .then((data) => {
            // Write the file contents in the middle of the panel
            const output_div = document.getElementById("output_div");
            output_div.innerText = data;
            console.log(data);
        })
        .catch((err) => {
            console.log(err);
        })
}

function main() {
    // Add on 'click' event listener on the fetch button
    const submit_button = document.getElementById("fetch_button");
    submit_button.addEventListener('click', handle_submit);
}

main()
