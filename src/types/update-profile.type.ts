export type updateProfileRequest = {
  firstName: string;
  lastName: string;
  color: number;
};

export type RemoveProfileImageResponse = string;

export type AddProfileImageRequest = FormData;

export type AddProfileImageResponse = {
  image: string; // The new image URL or filename
};
