import React from "react";
import { Wrapper } from "../../../components/shared/ui/Wrapper";
import { FormWrapper } from "../../../components/shared/ui/FormWrapper";
import { SpecInput } from "./SpecInput";

export const SpecPageView = ({ initialData, refetch }) => {
  return (
    <Wrapper>
      <FormWrapper>
        {initialData.map((spec) => (
          <SpecInput isEnabled={false} initialData={spec} refetch={refetch} />
        ))}
        <SpecInput isEnabled={true} refetch={refetch} />
      </FormWrapper>
    </Wrapper>
  );
};
