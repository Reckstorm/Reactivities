import { Profile } from "./profile"

export interface IActivity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  isHost?: boolean;
  isGoing?: boolean;
  isCancelled?: boolean;
  hostUsername?: string;
  host?: Profile;
  attendees?: Profile[];
}

export class Activity implements IActivity {
  id: string;
  title: string;
  date: Date | null;
  description: string;
  category: string;
  city: string;
  venue: string;
  isHost: boolean = false;
  isGoing: boolean = false;
  isCancelled: boolean = false;
  hostUsername: string = '';
  host?: Profile;
  attendees?: Profile[];

  constructor(init: ActivityFormValues){
    this.id = init.id!;
    this.title = init.title;
    this.description = init.description;
    this.category = init.category;
    this.date = init.date;
    this.city = init.city;
    this.venue = init.venue;
  }
}

export class ActivityFormValues {
  id?: string = undefined;
  title: string = '';
  date: Date | null = null;
  description: string = '';
  category: string = '';
  city: string = '';
  venue: string = '';

  constructor(activity?: ActivityFormValues) {
    if(activity){
      this.id = activity.id;
      this.title = activity.title;
      this.description = activity.description;
      this.category = activity.category;
      this.date = activity.date;
      this.city = activity.city;
      this.venue = activity.venue;
    }
  }
}