import z from "zod"

// ** Custom hooks for validation schemas ** \\
const getNameValidation = (name: "Firstname" | "Lastname") => (
    z.string().min(2, { message: `${name} must be at least 2 characters long` })
        .max(50, { message: `${name} cannot exceed 50 characters` })
        .trim()
);

export const basicAuthValidation = z.object({
    email: z.string().email({ error: "Invalid Email address" }).trim(),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});


export const useSignupSchema = () => {
    const schema = basicAuthValidation.extend({
        firstname: getNameValidation("Firstname"),
        lastname: getNameValidation("Lastname"),
    });
    return { schema }
}

export const useLoginSchema = () => {
    return { schema: basicAuthValidation }
}

export const useEditProfileSchema = () => {
    const schema = z.object({
        firstname: z.optional(z.string().min(2,
            { error: "Firstname must be at least 2 characters long" }).max(50,
                { error: "Firstname cannot exceed 50 characters" })),
        lastname: z.optional(z.string().min(2,
            { error: "Lastname must be at least 2 characters long" }).max(50,
                { error: "Lastname cannot exceed 50 characters" })),

        avatar: z.optional(z.string()),
    });

    return { schema }
}


export const relaxedAnalysisRequestSchema = z.object({
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    endpoint: z.string().min(1, "Endpoint is required"),
    body: z.string().optional().refine(
        (value) => {
            if (!value) return true;
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                return false;
            }
        },
        { message: "Body must be valid JSON" }
    ),
    headers: z.array(z.object({
        key: z.optional(z.string()),
        value: z.optional(z.string()),
    })),
    queryParams: z.array(z.object({
        key: z.optional(z.string()),
        value: z.optional(z.string()),
    })),
});