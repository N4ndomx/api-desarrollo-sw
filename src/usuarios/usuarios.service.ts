import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { Rol } from './entities/rol.entity';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly userRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>
  ) { }
  async create(createUsuarioDto: CreateUsuarioDto) {

    try {

      const { email, id_rol, ...data } = createUsuarioDto
      const userInDB = await this.userRepo.findOne({ where: { email } })

      if (userInDB) {
        throw new Error('User already exists');
      }
      const rol = await this.findRol(id_rol)
      const user = this.userRepo.create({
        ...data,
        email,
        id_rol: rol

      });

      const res = await this.userRepo.save(user);

      return res
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    return await this.userRepo.findOneBy({ id_usuario: id })
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOneBy({ email: email })
  }

  async findRol(id_rol: number) {
    const rol = await this.rolRepo.findOne({ where: { id_rol } })
    console.log(rol)
    if (!rol) {
      throw Error('Rol no localizado')
    }

    return rol
  }
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const cuenta = await this.findOne(id)
    const { id_rol, ...data } = updateUsuarioDto
    const rol = await this.findRol(id_rol)
    await this.userRepo.update(cuenta.id_usuario, {
      ...data,
      id_rol: rol
    })
    return { status: "ok" };
  }

  async remove(id: string) {
    const cuenta = await this.findOne(id)
    await this.userRepo.delete(cuenta.id_usuario)
    return cuenta
  }
}
