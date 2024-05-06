import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post";
import { Comment } from "./comment";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nickname: string;
  @Column({ unique: true })
  login: string;
  @Column()
  password: string;
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}
