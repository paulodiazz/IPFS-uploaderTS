import React from 'react';
import logo from './logo.svg';
import './App.css';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";

const projectId = "2FgFEQMEW6KoUuEKBEL3kivLVOT";
const projectSecret = "e5fd77d7dba87a46b1ce585edb829441";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

function App() {
  /**
 * @description event handler that uploads the file selected by the user
 */
const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const files = (form[0] as HTMLInputElement).files;

  if (!files || files.length === 0) {
    return alert("No files selected");
  }

  const file = files[0];
  // upload files
  const result = await (ipfs as IPFSHTTPClient).add(file);

  setImages([
    ...images,
    {
      cid: result.cid,
      path: result.path,
    },
  ]);
  console.log(result.path);
  form.reset();
};
  const [images, setImages] = React.useState<{ cid: CID; path: string }[]>([]);
  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization,
      },
    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }
  return (
    <div className="App">
      <header className="App-header">
        {!ipfs && (
          <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
        )}
        {ipfs && (
          <>
            <p>Upload File using IPFS</p>

            <form onSubmit={onSubmitHandler}>
              <input name="file" type="file" />

              <button type="submit">Upload File</button>
            </form>

            <div>
              {images.map((image, index) => (
                <img
                  alt={`Uploaded #${index + 1}`}
                  src={"https://desktware.infura-ipfs.io/ipfs/" + image.path}
                  style={{ maxWidth: "400px", margin: "15px" }}
                  key={image.cid.toString() + index}
                />
              ))}
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
