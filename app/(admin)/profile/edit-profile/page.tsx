import React from 'react'
import FormHeader from "@/components/lib/forms/form-header";
import {ProfileForm} from "@/components/lib/forms/profiles-form";

export default function EditProfile() {

    return (
        <div>
            <FormHeader
                title={'Edit Company Profile'}
                subtitle={'Update your company photo and details here.'}
            />
            <ProfileForm/>
        </div>
    );
}
