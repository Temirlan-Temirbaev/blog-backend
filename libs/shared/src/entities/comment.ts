import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";
import { Post } from "./post";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;
  @Column()
  content: string;
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.comments)
  author: User;
  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;
}
