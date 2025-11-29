import { useSignupSchema } from "@/hooks/useValidations";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import GoogleAuth from "@/components/auth/GoogleAuth";
import useAuth, { signupFormFieldData } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import useSignup from "@/hooks/useSignup";
import { AuthContext } from "@/contexts/AuthContext";


const Signup = (): React.ReactElement => {
    // ** Schema form references from ** \\
    const { schema } = useSignupSchema();

    // ** Context to handle authType switching ** \\
    const { setAuthType } = useContext(AuthContext);

    // ** State to handle show password state ** \\
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // ** Form being userd for validation ** \\
    const signupForm = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
        }
    });

    // ** Function to render form fields ** \\
    function renderFormFields() {
        return (
            signupFormFieldData.map((data, i) => (
                <FormField
                    key={i}
                    control={signupForm.control}
                    name={data.name}
                    render={({ field }) => (
                        <FormItem>
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        {...field}
                                        className={data.inputData.className}
                                        placeholder={data.inputData.placeholder}
                                        type={
                                            data.name === "password" ? (
                                                showPassword ? "text" : "password"
                                            ) : data.inputData.type
                                        }
                                    />
                                </FormControl>

                                {data.name === "password" && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="cursor-pointer absolute top-2 right-4 size-7
                                        text-muted-foreground"
                                        size="icon-sm"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <Eye /> : <EyeOff />}
                                    </Button>
                                )}
                            </div>
                            <FormMessage className="text-xs md:text-sm" />
                        </FormItem>
                    )}
                />
            ))
        )
    }

    // ** Custom hook to aid in signup and custom function to extract any validation errors ** \\
    const { error, createEffect, isLoading } = useSignup();
    const { extractValidationErrors, authState } = useAuth();
    const validationErrors = extractValidationErrors(error)
    return (
        <Form {...signupForm}>
            <form
                onSubmit={signupForm.handleSubmit(createEffect)}
                className="w-full h-fit space-y-4 rounded-lg p-6"
            >
                {/* Header */}
                <header className="text-center space-y-2 mb-6">
                    <h1 className="text-2xl font-semibold text-white">Create an account</h1>
                </header>

                {/* Extra validation errors (for if user bypasses frontend validation) */}
                {validationErrors.length > 0 && (
                    <div className="bg-destructive/10 w-full rounded-lg text-destructive text-sm p-4 border border-destructive/20 space-y-3
                    h-40 overflow-y-auto element-scrollable-hidden-scrollbar">
                        {validationErrors.map((error, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                                <p className="text-sm">{error.field} - {error.message}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Form fields */}
                {renderFormFields()}

                {/* Submit button */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer w-full rounded-lg h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    {isLoading && <Spinner />}
                    {isLoading ? "Processing..." : "Signup"}
                </Button>

                {/* Already have an account? */}
                <p className={`text-sm text-center text-white ${isLoading && "opacity-75"}`}>
                    Already have an account?{" "}
                    <strong
                        onClick={() => {
                            // if (isLoading) return;
                            return setAuthType("login");
                        }}
                        className="cursor-pointer text-primary hover:text-primary/80 transition-colors"
                    >
                        Login
                    </strong>
                </p>

                {/* oAuth */}
                <GoogleAuth disabled={isLoading} />
            </form>
        </Form>
    );
};

export default Signup;