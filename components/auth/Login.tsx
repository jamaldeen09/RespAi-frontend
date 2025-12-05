import useAuth, { loginFormFieldData } from "@/hooks/useAuth";
import { useLoginSchema } from "@/hooks/useValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleAuth from "@/components/auth/GoogleAuth";
import { Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import useLogin from "@/hooks/useLogin";
import { AuthContext } from "@/contexts/AuthContext";

const Login = (): React.ReactElement => {
    // ** Schema form references from ** \\
    const { schema } = useLoginSchema();

    // ** Context to handle authType switching ** \\
    const { setAuthType } = useContext(AuthContext);

    // ** State to handle show password state ** \\
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // ** Form being userd for validation ** \\
    const loginForm = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    // ** Function to render form fields ** \\
    function renderFormFields() {
        return (
            loginFormFieldData.map((data, i) => (
                <FormField
                    key={i}
                    control={loginForm.control}
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


    // ** Custom hook to aid in login. and custom function to extract any validation errors ** \\
    const { error, createEffect, isLoading } = useLogin();
    const { extractValidationErrors } = useAuth();
    const validationErrors = extractValidationErrors(error);
    return (
        <Form {...loginForm}>
            <form
                onSubmit={loginForm.handleSubmit(createEffect)}
                className="w-full h-fit space-y-4 rounded-lg p-6"
            >
                {/* Header */}
                <header className="text-center space-y-2 mb-9">
                    <h1 className="text-2xl font-semibold text-white">Login to your account</h1>
                </header>

                {/* Extra validation errors (for if user bypasses frontend validation) */}
                {validationErrors.length > 0 && (
                    <div
                        className="bg-red-100 w-full rounded-xl text-red-600 text-xs p-4 border
                   border-destructive space-y-3 overflow-y-auto h-40 element-scrollable-hidden-scrollbar"
                    >
                        {validationErrors.map((error, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                </svg>
                                <p>{error.field} - {error.message}</p>
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
                    {isLoading ? "Processing..." : "Login"}
                </Button>

                {/* Already have an account? */}
                <p className={`text-sm text-center text-white ${isLoading && "opacity-75"}`}>
                    Don't have an account? <strong onClick={() => {
                        if (isLoading) return;
                        setAuthType("signup")
                    }} className="cursor-pointer  text-primary hover:text-primary/80 transition-colors">Signup</strong>
                </p>

                {/* oAuth */}
                <GoogleAuth disabled={isLoading} />
            </form>
        </Form>
    );
};

export default Login;