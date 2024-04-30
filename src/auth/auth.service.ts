import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { JwtPayload } from './dto/jwtpalyload.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUsuarioDto } from 'src/usuarios/dto/create-usuario.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsuariosService,
    private readonly jwtService: JwtService,
  ) { }
  async validateUser(payload: JwtPayload) {
    const user = this.userService.findOne(payload.id_usuario)

    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  async register(userDto: CreateUsuarioDto) {
    let status = {
      success: true,
      message: 'user registered',
    };
    try {
      await this.userService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }


  async login(loginUserDto: LoginUserDto) {
    // find user in db    
    const user = await this.userService.findByEmail(loginUserDto.email);
    console.log(user)
    // generate and sign token    
    const token = this._createToken(user);

    return {
      email: user.email,
      ...token,

    };
  }

  private _createToken({ email, id_usuario, id_rol }: Usuario): any {
    const user: JwtPayload = { email, id_usuario, rol: id_rol };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn: process.env.EXPIRESIN,
      accessToken,
    };
  }

}
