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
    if(!input.trim()) return

    const delayDebounceFn = setTimeout(() => {
        submitButtonRef.current?.click()
    }, 500)
  
    return () => {
      clearTimeout(delayDebounceFn)
    }
  }, [input])
  

  useEffect(() => {
    if (state.output) {
      setoutput(state.output);
    }
  }, [state]);

  return (
    <div>
      <div>
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
      </div>
      <form action={formAction}>
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
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Translation"
              className="min-h-32 text-xl bg-gray-100 border-none"
              name="output"
              value={output}
              onChange={(e) => setoutput(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 px-5 py-3 rounded-md text-white cursor-pointer"
            ref={submitButtonRef}
          >
            Translate
          </button>
        </div>
      </form>
    </div>
  );
}

export default TranslationForm;
