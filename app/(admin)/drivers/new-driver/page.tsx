import FormHeader from "@/components/lib/forms/form-header";
import {DriversForm} from "@/components/lib/forms/drivers-form";

export default function NewDriver() {
    return (
        <div>
            <FormHeader
                title={'New Driver'}
                subtitle={'Use the form below to add new driver to the system.'}
            />

            <DriversForm/>
        </div>
    );
}

