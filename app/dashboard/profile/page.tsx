'use client';
import { Camera, Mail, Calendar, Crown, CreditCard, AlertCircle,  Edit, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { callToast } from '@/providers/SonnerProvider';
import { ProfileSkeleton } from '@/components/dashboard/ProfileSkeleton';
import { useGetProfileQuery } from '@/redux/apis/profileApi';
import { useAppSelector } from '@/redux/store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiResponse } from '@/redux/apiSettings';
import useRedux from '@/hooks/useRedux';
import HarmBurgerMenu from '@/components/reusable/HarmBurgerMenu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useDisableOrEnableAiAnalysis from '@/hooks/useDisableOrEnableAiAnalysis';
import { Spinner } from '@/components/ui/spinner';

const ProfileErrorState = ({
    error,
}: {
    error: string;
}) => {

    return (
        <div className="min-h-screen w-full">
            <nav className="border-b border-border mb-6 p-2 flex items-center justify-end xl:hidden">
                {/* Hamburger Menu */}
                <HarmBurgerMenu />
            </nav>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center space-y-8">
                    {/* Header */}
                    <header className="text-center">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Profile
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your account information
                        </p>
                    </header>

                    {/* Error Card */}
                    <Card className="border-destructive/50">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-8 h-8 text-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-foreground">
                                        Failed to Load Profile
                                    </h3>
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                </div>

                                <p className="text-sm text-muted-foreground max-w-md">
                                    We couldn't load your profile information. This might be due to a network issue or server problem. please refresh the page to try again
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};


export default function ProfilePage() {
    // ** Formats date ** \\
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // ** Redux hook helper ** \\
    const {
        mutateTrigger
    } = useRedux();

    // ** Rtk query hook ** \\
    const {
        isLoading,
        error,
        isError,
    } = useGetProfileQuery();

    // ** Users profile info ** \\
    const user = useAppSelector((state) => state.user.profile);

    // ** Function to determine if profile is being fetched ** \\

    const hasError = isError || error;

    // ** Function to extract error message ** \\
    const extractErrorMessage = (): string => {
        if (!error || !("data" in error)) return "";

        const errorMessage = ((error.data) as ApiResponse).message;
        return errorMessage;
    };

    // ** Hook that helps in disabling/enabling ai analysis action ** \\
    const {
        createEffect,
        isLoading: isDisablingOrEnablingAiAnalysis,
    } = useDisableOrEnableAiAnalysis();

    if (isLoading && !user) {
        return <ProfileSkeleton />
    };

    if (hasError && !user) {
        return <ProfileErrorState
            error={extractErrorMessage()}
        />
    };
    return (
        <div className="min-h-screen w-full bg-background">
            <nav className="border-b border-border mb-6 p-2 flex items-center justify-end xl:hidden">
                {/* Hamburger Menu */}
                <HarmBurgerMenu />
            </nav>
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Profile
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account information
                    </p>
                </header>

                {/* Profile Card */}
                <Card className="border-border">
                    <CardHeader className="text-center pb-6">
                        {/* Avatar Section */}
                        <div className="relative inline-block">
                            <Avatar className="w-24 h-24 border-2 border-border">
                                <AvatarImage src={user.avatar} alt={user.fullname} />
                                <AvatarFallback className="bg-muted text-foreground">
                                    {user.fullname.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                onClick={() => callToast("info", "This feature is not available yet, we are sorry for the inconvenience", 6000)}
                                disabled={isLoading}
                                size="icon"
                                variant="secondary"
                                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-background cursor-pointer"
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>

                        <CardTitle className="text-xl mt-4 text-foreground">{user.fullname}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Edit Button */}
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                onClick={() => mutateTrigger("editProfile", true)}
                                variant="outline"
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Edit />
                                Edit Profile
                            </Button>

                            <Tooltip >
                                <TooltipTrigger
                                    disabled={isDisablingOrEnablingAiAnalysis}
                                    onClick={createEffect}
                                    className="items-center text-white
                                    inline-flex justify-center gap-2 whitespace-nowrap rounded-md 
                                    text-sm font-medium transition-all disabled:pointer-events-none 
                                    disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 
                                    [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 
                                    focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 
                                   aria-invalid:border-destructive px-2 bg-background border border-border cursor-pointer hover:bg-accent"
                                >
                                    {isDisablingOrEnablingAiAnalysis ? <Spinner /> : (
                                        user.enableAiAnalysis ? <Lock /> : <Unlock />
                                    )}
                                    {isDisablingOrEnablingAiAnalysis && user.enableAiAnalysis ? "Disabling..." :
                                        isDisablingOrEnablingAiAnalysis && !user.enableAiAnalysis ? "Enabling..." : (
                                            user.enableAiAnalysis ? "Disable ai" : "Enable ai"
                                        )}
                                </TooltipTrigger>
                                <TooltipContent className="bg-accent text-white">
                                    <p>Turn AI analysis on or off. Disabling this prevents credit usage</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* Account Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullname" className="text-sm font-medium text-foreground">
                                    Full Name
                                </Label>
                                <div className="p-3 rounded-md bg-muted/50 border border-border text-foreground">
                                    {user.fullname}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email Address
                                </Label>
                                <div className="p-3 rounded-md bg-muted/50 border border-border text-foreground">
                                    {user.email}
                                </div>
                            </div>

                            {/* Credits */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Available Credits
                                </Label>
                                <div className="p-3 rounded-md bg-muted/50 border border-border">
                                    <span className="text-xl font-bold text-foreground">{user.credits}</span>
                                    <span className="text-sm text-muted-foreground ml-2">{user.credits === 1 ? "credit" : "credits"}</span>
                                </div>
                            </div>

                            {/* Plan */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Crown className="w-4 h-4" />
                                    Current Plan
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Badge className="text-sm">
                                        {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'No Plan'}
                                    </Badge>
                                    <Button
                                        onClick={() => callToast("info", "This feature is not available yet, we are sorry for the inconvenience", 6000)}
                                        variant="outline"
                                        className="hover:bg-background bg-background opacity-70 hover:opacity-70"
                                        size="sm"
                                    >
                                        Upgrade
                                    </Button>
                                </div>
                            </div>

                            {/* Created At */}
                            <div className="space-y-2 md:col-span-2">
                                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member Since
                                </Label>
                                <div className="p-3 rounded-md bg-muted/50 border border-border text-foreground">
                                    {formatDate(user.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                            <Button
                                onClick={() => callToast("info", "This feature is not available yet, we are sorry for the inconvenience", 6000)}
                                className="flex-1 bg-primary text-primary-foreground opacity-70 hover:opacity-70 hover:bg-primary"
                            >
                                Manage Subscription
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );


} 
