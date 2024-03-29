import React from "react";
import {SpecInputView} from "./SpecInputView";
import {UPDATE_SPECIALIZATION_MUTATION} from "../../../../graphql/mutations/updateSpecialization";
import {DELETE_SPECIALIZATION_MUTATION} from '../../../../graphql/mutations/deleteSpecialization'
import {useMutation} from "@apollo/client";

export const SpecInput = ({initialData = {}, refetch, isEnabled}) => {
    const [updateSpec] = useMutation(UPDATE_SPECIALIZATION_MUTATION);
    const [deleteSpec] = useMutation(DELETE_SPECIALIZATION_MUTATION);

    return (
        <SpecInputView
            initialData={{
                ...initialData,
                id: initialData.id || 0,
            }}
            refetch={refetch}
            updateSpec={updateSpec}
            deleteSpec={deleteSpec}
            isEnabled={isEnabled}
        />
    );
};
