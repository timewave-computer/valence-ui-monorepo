"use client";

import { CheckCircle, Dropdown, TextInput } from "@/components";
import { useState } from "react";

const CovenantPage = () => {
  const [partyA, setPartyA] = useState("");
  const [partyAParameterA, setPartyAParameterA] = useState("");
  const [partyAParameterB, setPartyAParameterB] = useState("");
  const [partyAParameterC, setPartyAParameterC] = useState("");
  const [partyAParameterD, setPartyAParameterD] = useState("");
  const [partyAParameterE, setPartyAParameterE] = useState(true);

  const [partyB, setPartyB] = useState("");
  const [partyBParameterA, setPartyBParameterA] = useState("");
  const [partyBParameterB, setPartyBParameterB] = useState("");
  const [partyBParameterC, setPartyBParameterC] = useState("");
  const [partyBParameterD, setPartyBParameterD] = useState("");
  const [partyBParameterE, setPartyBParameterE] = useState(true);

  return (
    <main className="flex min-h-screen flex-col p-12 bg-black">
      <div className="flex flex-row items-stretch gap-8 grow">
        <div className="flex shrink-0 flex-col gap-4 text-white text-lg ">
          <div className="flex flex-row gap-6 items-center">
            <TextInput
              input={partyA}
              onChange={setPartyA}
              placeholder="Party A"
            />

            <p>agrees that,</p>
          </div>

          <p className="pl-4">upon initiation:</p>

          <ul className="list-disc pl-12">
            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter A</p>

                <Dropdown
                  options={PARAMETER_OPTIONS}
                  selected={partyAParameterA}
                  onSelected={setPartyAParameterA}
                />
              </div>
            </li>

            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter B</p>

                <Dropdown
                  options={PARAMETER_OPTIONS}
                  selected={partyAParameterB}
                  onSelected={setPartyAParameterB}
                />
              </div>
            </li>
          </ul>

          <p className="pl-4">upon early release:</p>

          <ul className="list-disc pl-12">
            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter C</p>

                <TextInput
                  input={partyAParameterC}
                  onChange={setPartyAParameterC}
                />
              </div>
            </li>

            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter D</p>

                <Dropdown
                  options={PARAMETER_OPTIONS}
                  selected={partyAParameterD}
                  onSelected={setPartyAParameterD}
                />
              </div>
            </li>
          </ul>

          <p className="pl-4">upon conclusion:</p>

          <ul className="list-disc pl-12">
            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter C</p>

                <CheckCircle
                  checked={partyAParameterE}
                  onChange={setPartyAParameterE}
                />
              </div>
            </li>
          </ul>

          <div className="border-b border-dashed border-slate-400 my-8"></div>

          <div className="flex flex-row gap-6 items-center">
            <TextInput
              input={partyB}
              onChange={setPartyB}
              placeholder="Party B"
            />

            <p>agrees that,</p>
          </div>

          <p className="pl-4">upon initiation:</p>

          <ul className="list-disc pl-12">
            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter A</p>

                <Dropdown
                  options={PARAMETER_OPTIONS}
                  selected={partyBParameterA}
                  onSelected={setPartyBParameterA}
                />
              </div>
            </li>

            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter B</p>

                <Dropdown
                  options={PARAMETER_OPTIONS}
                  selected={partyBParameterB}
                  onSelected={setPartyBParameterB}
                />
              </div>
            </li>
          </ul>

          <p className="pl-4">upon early release:</p>

          <ul className="list-disc pl-12">
            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter C</p>

                <TextInput
                  input={partyBParameterC}
                  onChange={setPartyBParameterC}
                />
              </div>
            </li>

            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter D</p>

                <Dropdown
                  options={PARAMETER_OPTIONS}
                  selected={partyBParameterD}
                  onSelected={setPartyBParameterD}
                />
              </div>
            </li>
          </ul>

          <p className="pl-4">upon conclusion:</p>

          <ul className="list-disc pl-12">
            <li>
              <div className="p-1 flex flex-row gap-6 items-center">
                <p>Parameter C</p>

                <CheckCircle
                  checked={partyBParameterE}
                  onChange={setPartyBParameterE}
                />
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-[#f5edd6] text-xs flex flex-col gap-4 font-mono text-black grow p-12">
          <p>I. Initial terms</p>

          <div className="mt-6 ml-6 flex flex-col gap-4">
            <p>
              <span className="font-extrabold italic">
                {partyA || "Party A"}
              </span>{" "}
              agrees to the following:{" "}
            </p>

            <p className="pl-4">
              Bacon ipsum dolor amet pork chop ball tip venison meatloaf
              burgdoggen{" "}
              <span className="font-extrabold italic">
                {partyAParameterA || "Parameter A"}
              </span>{" "}
              tri-tip landjaeger. Tri-tip leberkas beef, alcatra tenderloin
              chislic pork chop short ribs sausage short loin. Fatback flank
              tongue, prosciutto boudin ground round beef ball tip sausage
              tenderloin. Burgdoggen cow alcatra, biltong picanha short ribs
              beef venison shoulder leberkas tongue strip steak shankle{" "}
              <span className="font-extrabold italic">
                {partyAParameterB || "Parameter B"}
              </span>
              .
            </p>
          </div>

          <div className="mt-4 ml-6 flex flex-col gap-4">
            <p>
              <span className="font-extrabold italic">
                {partyB || "Party B"}
              </span>{" "}
              agrees to the following:{" "}
            </p>

            <p className="pl-4">
              Cow doner strip steak flank pork loin beef ham hock shank{" "}
              <span className="font-extrabold italic">
                {partyBParameterA || "Parameter A"}
              </span>{" "}
              bresaola tenderloin salami pork belly chislic. Ball tip doner
              swine chicken cow pancetta ham hock pork loin pork turkey fatback.
              Kevin ball tip tongue shank spare ribs, sirloin doner turkey beef
              ribs shoulder boudin fatback{" "}
              <span className="font-extrabold italic">
                {partyBParameterB || "Parameter B"}
              </span>
              .
            </p>
          </div>

          <p className="mt-8">II. Early release</p>
          <p className="ml-6 mt-2">
            In the event one or both parties wants to terminate this agreement
            before its natural conclusion, they have set forth the following
            terms.
          </p>

          <div className="mt-4 ml-6 flex flex-col gap-4">
            <p>
              <span className="font-extrabold italic">
                {partyA || "Party A"}
              </span>{" "}
              ground round alcatra, picanha pig cupim pancetta turducken
              meatloaf fatback jerky. Sausage ball tip beef ribs, meatball
              ribeye t-bone{" "}
              <span className="font-extrabold italic">
                {partyAParameterC || "Parameter C"}
              </span>{" "}
              turkey. Meatloaf pork loin pancetta, pork chop porchetta chislic
              prosciutto beef bacon leberkas bresaola drumstick cow alcatra
              rump. Kevin burgdoggen ham hock, meatloaf ground round shoulder
              beef turducken spare ribs short loin kielbasa{" "}
              <span className="font-extrabold italic">
                {partyAParameterD || "Parameter D"}
              </span>
              .
            </p>
          </div>

          <div className="mt-4 ml-6 flex flex-col gap-4">
            <p>
              <span className="font-extrabold italic">
                {partyB || "Party B"}
              </span>{" "}
              bacon jerky spare ribs strip steak doner meatball alcatra rump
              sirloin{" "}
              <span className="font-extrabold italic">
                {partyBParameterC || "Parameter C"}
              </span>{" "}
              venison ground round jowl. Buffalo pancetta chicken bacon. Short
              ribs prosciutto filet mignon pork chop venison buffalo short loin
              jerky swine{" "}
              <span className="font-extrabold italic">
                {partyBParameterD || "Parameter D"}
              </span>
              , drumstick shoulder.
            </p>
          </div>

          <p className="mt-8">III. Conclusion</p>
          <p className="ml-6 mt-2">
            Upon the conclusion of this agreement,{" "}
            <span className="font-extrabold italic">{partyA || "Party A"}</span>{" "}
            agrees to{" "}
            {partyAParameterE
              ? "sirloin rump alcatra pastrami pork t-bone andouille filet mignon chislic buffalo"
              : "filet mignon drumstick pork loin andouille turkey landjaeger salami ham"}
            , whereas{" "}
            <span className="font-extrabold italic">{partyB || "Party B"}</span>{" "}
            agrees to
            {partyBParameterE
              ? "short loin t-bone pancetta doner tri-tip cow meatball meatloaf fatback"
              : "burgdoggen ground round frankfurter jowl corned beef pancetta pig pork"}
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default CovenantPage;

const PARAMETER_OPTIONS = [
  {
    label: "Option 1",
    value: "Option 1",
  },
  {
    label: "Option 2",
    value: "Option 2",
  },
  {
    label: "Option 3",
    value: "Option 3",
  },
];
