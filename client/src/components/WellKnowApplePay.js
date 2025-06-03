import { useEffect } from "react";
import { useHistory } from "react-router";

const processorUrl =
  process.env.REACT_APP_COMMERCETOOLS_CHECKOUT_CONNECTOR_PROCESSOR_URL;

function WellKnowApplePay() {
  const history = useHistory();

  useEffect(() => {
    const downloadFile = async () => {
      try {
        const response = await fetch(`${processorUrl}/applePayConfig`, {
          method: "GET",
        });


        if (!response.ok) {
          throw new Error(`Error fetching file: ${response.statusText}`);
        }

        const fileContent = await response.text(); // Or response.json() if it's JSON

        const blob = new Blob([fileContent], { type: "text/plain" }); // Adjust MIME type if necessary

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        link.download = "apple-developer-merchantid-domain-association.txt";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        history.push("/");
      } catch (error) {
        console.error("Error downloading file:", error);
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
