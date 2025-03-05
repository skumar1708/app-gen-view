import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import CodeSandboxClone from "./CodeEditor";

// const socket = io("https://app-generator-backend.vercel.app/");

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessages, setStatusMessages] = useState([]);
  const [deployedUrl, setDeployedUrl] = useState(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const textareaRef = useRef(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://app-generator-backend.vercel.app');
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if(!socket) return;
    socket.on("status", (message) => {
      setStatusMessages((prevMessages) => [
        ...prevMessages.map((item) => ({
          ...item,
          text: `✅ ${item.text.replaceAll("✅", "").replaceAll("🔄", "")}`,
          loading: false,
        })),
        { text: message, loading: true },
      ]);
    });

    socket.on("error", (message) => {
      setStatusMessages((prevMessages) => [
        ...prevMessages.map((item) => ({
          ...item,
          text: `✅ ${item.text.replaceAll("✅", "").replaceAll("🔄", "")}`,
          loading: false,
        })),
        { text: `❌ ${message}`, loading: false },
      ]);
      setLoading(false);
    });

    socket.on("done", () => {
      setLoading(false);
      setStatusMessages((prevMessages) =>
        prevMessages.map((item) => ({
          ...item,
          text: `✅ ${item.text.replaceAll("✅", "").replaceAll("🔄", "")}`,
          loading: false,
        })),
      );
    });

    socket.on("deployed", (url) => {
      setDeployedUrl(url);
      setIsDeployed(true);
      setLoading(false);
      setStatusMessages((prevMessages) =>
        prevMessages.map((item) => ({
          ...item,
          text: `✅ ${item.text.replaceAll("✅", "").replaceAll("🔄", "")}`,
          loading: false,
        })),
        { text: `✅ Deployment done`, loading: false },
      );
    });

    return () => {
      socket.off("status");
      socket.off("error");
      socket.off("done");
      socket.off("deployed");
    };
  }, [socket]);

  const handleGenerate = async () => {
    try {
      setStatusMessages([]);
      setLoading(true);
      if (isDeployed) {
        setIsDeployed(false);
        setDeployedUrl(null);
      }
      setShowStatusPopup(true);
      socket.emit("generateProject", input);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateAsciiHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
    }
    return hash.toString(16);
  };

  const LoaderSVG = () => (
    <svg
      className="animate-spin h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const handlePreview = () => {
    if (deployedUrl) {
      window.open(deployedUrl, "_blank");
    }
  };

  const closeStatusPopup = () => {
    setShowStatusPopup(false);
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.maxHeight = "300px";
    }
  };

  const handleStatusButtonClick = () => {
    setShowStatusPopup(true);
  };

  // if (true) {
  //   return <CodeSandboxClone owner="skumar1708" repo="app-1740982882661"/>
  // }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Generate Your Web App</h1>
      {(
        <textarea
          ref={textareaRef}
          className="p-2 border rounded w-1/2 resize-none overflow-y-auto"
          value={input}
          onChange={handleTextareaChange}
          placeholder="Describe your app idea..."
          style={{ minHeight: "100px" }}
        />
      )}
      <div className="flex mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : isDeployed ? "Regenerate" : "Generate"}
        </button>
        {!showStatusPopup && !isDeployed && statusMessages.length > 0 && (
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            onClick={handleStatusButtonClick}
          >
            Status
          </button>
        )}
        {isDeployed && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
            onClick={handlePreview}
          >
            Preview
          </button>
        )}
      </div>

      {showStatusPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative p-8 bg-white w-1/2 rounded-xl shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeStatusPopup}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold mb-4">Status Messages</h2>
            <ul className="space-y-1 rounded-xl overflow-hidden divide-y divide-gray-300">
              {statusMessages.map((item) => (
                <li
                  key={generateAsciiHash(item.text)}
                  className="flex items-center gap-3 transition duration-300"
                >
                  {item.loading && <LoaderSVG />}
                  <span className="font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
            {isDeployed && (
              <div className="flex justify-center mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handlePreview}
                >
                  Preview
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}