import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../role/role.enum';
import { Profile } from '../profile/profile.entity';
import * as bcrypt from 'bcryptjs';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: Role.ADMIN })
  @Exclude()
  role: Role = Role.ADMIN;

  @Column({ nullable: true, select: false })
  @Exclude()
  googleId: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: false,
  })
  @JoinColumn()
  @Exclude()
  profile: Profile;

  @Column({ nullable: true, select: false })
  @Exclude()
  password: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  salt: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  registrationToken: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  confirmationToken: string;

  @Column()
  @Exclude()
  profileId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(email: string, role: Role) {
    super();
    this.email = email;
    this.role = role;
  }

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
