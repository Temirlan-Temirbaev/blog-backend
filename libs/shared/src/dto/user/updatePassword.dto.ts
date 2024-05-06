export class UpdatePasswordDto {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}
