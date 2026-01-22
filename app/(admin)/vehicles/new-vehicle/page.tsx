import FormHeader from "@/components/lib/forms/form-header";
import { VehiclesForm } from "@/components/lib/forms/vehicles-form";

export default function NewVehicle() {
    return (
        <div>
            <FormHeader
                title={'New Vehicle'}
                subtitle={'Use the form below to add new vehicle to the system.'}
            />

            <VehiclesForm />
        </div>
    );
}

