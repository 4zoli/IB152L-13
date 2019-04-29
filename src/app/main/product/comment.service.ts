import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MyComment } from './mycomment.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class CommentService {

  comments: MyComment[];
  rating: number;
  private commentsUpdated = new Subject<{comments: MyComment[]}>();
  private ratingUpdated = new Subject<number>();

  constructor(private http: HttpClient, private router: Router) {}

  getComments(id: number) {
    this.http.get<{comments: any[]}>('http://localhost:3000/api/opinion/comments/' + id)
      .pipe(map(commentData => {
        return { transformedComments: commentData.comments.map( comments => {
          return {
            COMMENTDATE: new Date(comments.COMMENTDATE),
            USER_ID: comments.USER_ID,
            PRODUCT_ID: comments.PRODUCT_ID,
            CONTENT: comments.CONTENT
          };
        })};
      }))
      .subscribe(commentData => {
        this.comments = commentData.transformedComments;
        this.commentsUpdated.next({comments: this.comments});
      });
  }

  getRating(id: number) {
    this.http.get<{rating:number}>('http://localhost:3000/api/opinion/rating/' + id)
      .subscribe(ratingData => {
        this.rating = ratingData.rating;
        this.ratingUpdated.next(this.rating);
      });
  }

  addComment(productId: number, content: string) {
    this.http.post('http://localhost:3000/api/opinion/comments/' + productId, {content}).subscribe(response => {
      console.log(response);
    });
  }


  getCommentsUpdateListener() {
    return this.commentsUpdated.asObservable();
  }

  getRatingUpdateListener() {
    return this.ratingUpdated.asObservable();
  }
}
