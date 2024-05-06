import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  @Column({ type: "timestamptz", nullable: true })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.posts)
  author: User;
}
