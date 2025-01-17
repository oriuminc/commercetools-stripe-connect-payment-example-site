import { useEffect } from "react";
import { useHistory } from "react-router";
import { getCTSessionId, loadEnabler } from "../utils";

const processorUrl = process.env.REACT_APP_PROCESOR_URL;

function WellKnowApplePay({cart}) {
  const history = useHistory(); // Use history instead of navigate

  useEffect(() => {
    const downloadFile = async () => {
      try {

        // Make API call to fetch the file content (string)
        const response = await fetch(`${processorUrl}/.well-known/apple-developer-merchantid-domain-association`, {
          method: "GET",
        });

        console.log(response)

        if (!response.ok) {
          throw new Error(`Error fetching file: ${response.statusText}`);
        }

        // Get the file content as a string
        const fileContent = await response.text(); // Or response.json() if it's JSON

        // Convert the string to a Blob
        const blob = new Blob([fileContent], { type: "text/plain" }); // Adjust MIME type if necessary

        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a temporary <a> element to trigger the download
        const link = document.createElement("a");
        link.href = url;

        // Set the file name for download
        const fileName = "apple-developer-merchantid-domain-association.txt"; // Change this dynamically if needed
        link.download = fileName;

        // Append the link to the body, trigger click, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Revoke the URL to release memory
        window.URL.revokeObjectURL(url);

        // Redirect or display a message after download (optional)
        history.push("/"); // Redirect to home or another page
      } catch (error) {
        console.error("Error downloading file:", error);
        // Handle error (e.g., show error message or redirect)
        history.push("/");
      }
    };

    downloadFile();
  }, [history]);

  return (
    <div>
      <p>Downloading your file...</p>
    </div>
  );
}
export default WellKnowApplePay;
