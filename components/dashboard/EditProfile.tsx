import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEditProfileSchema } from '@/hooks/useValidations';
import { X } from 'lucide-react';
import z from "zod"
import useRedux from '@/hooks/useRedux';
import CustomAvatar from '../reusable/CustomAvatar';
import { useAppSelector } from '@/redux/store';
import useEditProfile from '@/hooks/useEditProfile';
import { Spinner } from '../ui/spinner';

const EditProfile = (): React.ReactElement => {
  const { schema } = useEditProfileSchema();
  const {
    mutateTrigger
  } = useRedux();

  // ** Current users profile ** \\
  const userProfile = useAppSelector((state) => state.user.profile);

  // ** Firstname and Lastname ** \\
  const nameParts = userProfile.fullname.split(' ');
  const firstname = nameParts[0] || '';
  const lastname = nameParts.slice(1).join(' ') || '';


  const editProfileForm = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: firstname || "",
      lastname: lastname || "",
      avatar: 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg'
    }
  });

  // ** Hook to handle profile editing ** \\
  const watchedValues = {
    firstname: editProfileForm.watch("firstname") || "",
    lastname: editProfileForm.watch("lastname") || "",
    avatar: editProfileForm.watch("avatar") || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg",
  }
  const {
    createEffect,
    isLoading
  } = useEditProfile(watchedValues);

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-6">
          <CustomAvatar
            fallback='Avatar'
            size="md"
            src='https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3407.jpg'
          />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Edit Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your personal information
        </p>
      </div>

      <Form {...editProfileForm}>
        <form onSubmit={editProfileForm.handleSubmit(createEffect)} className="space-y-4">
          {/* First Name */}
          <FormField
            control={editProfileForm.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">First Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Enter your first name"
                    {...field}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={editProfileForm.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Last Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Enter your last name"
                    {...field}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />

          {/* Avatar (Disabled) */}
          <FormField
            control={editProfileForm.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Avatar</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    className="bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Avatar changes are currently unavailable
                </p>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button

              type="button"
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => mutateTrigger("editProfile", false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isLoading && <Spinner />}
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;