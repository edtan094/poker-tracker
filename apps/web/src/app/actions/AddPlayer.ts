import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const addSchema = z.object({
  name: z.string().min(1),
  buyins: z.number().min(1),
  gainslosses: z.number().min(1),
});

export async function addPlayer(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  console.log("data", data);

  redirect("new-game");
}
