import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Full name must be at least 3 characters long' })
  @MaxLength(20, { message: 'Full name must be at most 20 characters long' })
  fullName: string; 

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;    
};

export class SigninUserDto {
  
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;    
}

export default {
  CreateUserDto,
  SigninUserDto,
};

