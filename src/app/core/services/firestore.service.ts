import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/firestore';
import {NGXLogger} from 'ngx-logger';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private db: AngularFirestore,
              private logger: NGXLogger) { }
  // Private helpers
  private col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
    return typeof ref === 'string' ? this.db.collection<T>(ref, queryFn) : ref;
}
  private doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
    return typeof ref === 'string' ? this.db.doc<T>(ref) : ref;
  }
  public doc$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(map(doc => {
      this.logger.trace('Getting doc from DB', doc.payload.id, '->', doc.payload.data());
      return doc.payload.data() as T;
    }));
  }

  // Get collection
  public col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(doc => {
      return doc.map(a => a.payload.doc.data()) as T[];
    }));
  }
  // Set specific document to a new value
  public set<T>(ref: DocPredicate<T>, data: T) {
    return this.doc(ref).set({
      ...data
    });
  }
  public colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
    return this.col(ref, queryFn).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  public docWithId$<T>(ref: DocPredicate<T>): Observable<T> {
    return this.doc(ref).snapshotChanges().pipe(map(doc => {
      const data = doc.payload.data() as T;
      const id = doc.payload.id;
      return {id, ...data};
    }));
  }

  // Add data to collection
  public add<T>(ref: CollectionPredicate<T>, data: T) {
    // const timestamp = this.timestamp;
    this.logger.debug('Adding to collection', ref, '->', data);
    return this.col(ref).add({
      ...data
    });
  }
  delete<T>(ref: DocPredicate<T>) {
    return this.doc(ref).delete();
  }

  public updateWithoutId<T>(ref: DocPredicate<T>, data: T) {
    const dataClone = this.copyObject(data);
    delete dataClone.id;

    return this.doc(ref).update({
      ...dataClone
    });
  }

  private copyObject(src) {
    return Object.assign({}, src);
  }
}
