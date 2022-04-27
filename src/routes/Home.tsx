import { Some, Ok, Err, Option, None } from "optionem";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, useEffect, useState } from "react";

import { readFile } from "../helpers/helpers";
import { useStore, useDispatch } from "../store";

function Home() {
  const store = useStore();
  const [errorMessage, setErrorMessage] = useState<Option<string>>(new None());

  useEffect(() => {
    setErrorMessage(
      store.andThen((value) => {
        return value.match({
          Ok(): Option<string> {
            return new None();
          },
          Err(err): Option<string> {
            if (err.type === "NoFileSelected") {
              return new Some("No file selected. Please select a file.");
            } else if (err.type === "FailedToParseFile") {
              return new Some(
                "Failed to parse file. Please check the file format."
              );
            } else {
              return new Some("Something went wrong. Please try again.");
            }
          },
        });
      })
    );
  }, [store]);

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">What does this website do?</h1>
            <p className="py-6">
              This website takes the data from the Telegram export file and
              analyzes it. It shows information like a rank of people in a
              Telegram group sorted by how many hats they have sent.
            </p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm bg-base-300">
            <div className="card-body">
              {errorMessage
                .map((error) => {
                  return <ErrorMessage error={error} />;
                })
                .unwrapOr(<></>)}
              <UploadForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="alert font-bold text-error ">
      <div>
        <svg
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  );
}

function UploadForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);

    const file = e.target.files?.item(0);

    if (!file) {
      setLoading(false);

      return dispatch({
        type: "SET_STATE",
        payload: new Some(
          new Err({
            type: "NoFileSelected",
          })
        ),
      });
    }

    const content = await readFile(file);
    try {
      const data = JSON.parse(content);
      dispatch({
        type: "SET_STATE",
        payload: new Some(new Ok(data)),
      });
      navigate("/analytics");
    } catch {
      setLoading(false);
      dispatch({
        type: "SET_STATE",
        payload: new Some(
          new Err({
            type: "FailedToParseFile",
            filename: file.name,
          })
        ),
      });
    }
  };

  return (
    <>
      <label htmlFor="cats" className="btn btn-primary">
        <svg
          fill="#fff"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
        </svg>
        <span className="ml-2">
          {loading ? "Loading.." : "Select Export Data"}
        </span>
      </label>
      <input
        id="cats"
        type="file"
        accept=".json"
        multiple={false}
        onChange={handleFileInput}
        className="cursor-pointer absolute block opacity-0 pin-r pin-t"
      />
    </>
  );
}

export default Home;
