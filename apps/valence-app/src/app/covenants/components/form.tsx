import { Checkbox, Dropdown, DropdownOption } from "@/components";
import { InputLabel, TextInput } from "@valence-ui/ui-components";
import { cn } from "@/utils";

export type Field = {
  key: string;
  label?: string;
  placeholder?: string;
  if?: (data: any) => boolean;
} & (
  | {
      type: "text";
      /**
       * Whether or not the label should inline.
       */
      inlineLabel?: boolean;
    }
  | {
      type: "check";
    }
  | {
      type: "dropdown";
      options: DropdownOption<string>[];
    }
  | {
      type: "group";
      fields: Field[];
      /**
       * Whether or not to bold the group title.
       */
      bold?: boolean;
      /**
       * Whether or not to indent the group fields.
       */
      indent?: boolean;
    }
);

type FieldProps = {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  /**
   * Top-level data object.
   */
  data: Record<string, any>;
};

export const Field = ({ field, value, onChange, data }: FieldProps) => {
  if (field.if && !field.if(data)) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex gap-1",
        field.type === "check"
          ? "flex-row items-center justify-between"
          : "flex-col",
      )}
    >
      {!!field.label && !(field.type === "text" && field.inlineLabel) && (
        <InputLabel size="sm" noGap label={field.label} />
      )}

      {field.type === "text" ? (
        <TextInput
          value={value}
          onChange={onChange}
          placeholder={field.placeholder}
        />
      ) : field.type === "check" ? (
        <Checkbox checked={!!value} onChange={onChange} />
      ) : field.type === "dropdown" ? (
        <Dropdown
          containerClassName="font-mono text-sm"
          options={field.options}
          selected={value}
          onSelected={onChange}
        />
      ) : field.type === "group" ? (
        <div
          className={cn(
            "flex flex-col gap-4",
            field.indent && "border-l-2 border-valence-lightgray p-2 pl-4",
          )}
        >
          {field.fields.map((field, i) => (
            <Field
              key={`dropdown-${i}-${field.key}`} // low pri TODO: find a way to construct key without index
              field={field}
              value={value?.[field.key]}
              data={data}
              onChange={(newValue) =>
                onChange({
                  ...(value || {}),
                  [field.key]: newValue,
                })
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
