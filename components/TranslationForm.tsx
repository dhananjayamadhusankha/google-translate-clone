"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITranslationLanguages } from "@/types/ITranslationLanguages";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import translate from "@/actions/translate";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import { Button } from "./ui/button";
import { Volume2Icon } from "lucide-react";
import Recorder from "./Recorder";

const initialState = {
  inputLanguage: "auto",
  input: "",
  outputLanguage: "si",
  output: "",
};

export type State = typeof initialState;

function TranslationForm({ languages }: { languages: ITranslationLanguages }) {
  const [input, setinput] = useState("");
  const [output, setoutput] = useState("");
  const [state, formAction] = useFormState(translate, initialState);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!input.trim()) return;

    const delayDebounceFn = setTimeout(() => {
      submitButtonRef.current?.click();
    }, 1000);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [input]);

  useEffect(() => {
    if (state.output) {
      setoutput(state.output);
    }
  }, [state]);

  const playAudio = async () => {
    const synth = window.speechSynthesis;

    if (!output || !synth) return;

    const wordToSay = new SpeechSynthesisUtterance(output);
    synth.speak(wordToSay);
  };

  const uploadAudio = async (blob: Blob) => {
    const mimeType = "audio/webm";

    const file = new File([blob], mimeType, { type: mimeType });

    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("/transcribeAudio", {
      method: "POST",
      body: formData
    })

    const audio = await response.json()

    if (audio.text) {
      setinput(audio.text);
    }
  };

  return (
    <div>
      <form action={formAction}>
        <div className="flex space-x-2">
          <div className="flex items-center group space-x-2 bg-[#E7F0FE] w-fit px-3 py-2 rounded-md cursor-pointer border mb-5">
            <Image
              src="https://links.papareact.com/r9c"
              alt="logo"
              width={30}
              height={30}
            />
            <p className="text-blue-500 text-sm font-medium group-hover:underline">
              Text
            </p>
          </div>
          <Recorder uploadAudio={uploadAudio} />
        </div>
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
          {/* left */}
          <div className="flex-1 space-y-2">
            <Select name="inputLanguage" defaultValue="auto">
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a Language" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Want us to figure it out?</SelectLabel>
                  <SelectItem key="auto" value="auto">
                    Auto-Detection{" "}
                  </SelectItem>
                </SelectGroup>

                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-32 text-xl"
              name="input"
              value={input}
              onChange={(e) => setinput(e.target.value)}
            />
          </div>
          {/* rigth */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <Select name="outputLanguage" defaultValue="si">
                <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                  <SelectValue placeholder="Select a Language" />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Want us to figure it out?</SelectLabel>
                    <SelectItem key="auto" value="auto">
                      Auto-Detection{" "}
                    </SelectItem>
                  </SelectGroup>

                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    {Object.entries(languages.translation).map(
                      ([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.name}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant={"ghost"}
                onClick={playAudio}
                disabled={!output}
              >
                <Volume2Icon
                  size={24}
                  className="text-blue-500 cursor-pointer disabled:cursor-not-allowed"
                />
              </Button>
            </div>
            <Textarea
              placeholder="Translation"
              className="min-h-32 text-xl bg-gray-100 border-none"
              name="output"
              value={output}
              onChange={(e) => setoutput(e.target.value)}
            />
          </div>
        </div>
        <div className="flex mt-6 lg:justify-end">
          <SubmitButton disabled={!input} />
          <button type="submit" ref={submitButtonRef} hidden>
            Translate
          </button>
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
