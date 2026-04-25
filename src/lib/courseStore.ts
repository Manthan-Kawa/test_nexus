/**
 * courseStore.ts — lightweight localStorage persistence for enrolled courses.
 * No external state library needed; components call the hook to read/write.
 */

export type CourseLesson = { title: string; done: boolean };

export type CourseModule = {
  label: string;
  status: "completed" | "progress" | "locked";
  pct: number;
  currentLesson: string;
  lessons: CourseLesson[];
};

export type EnrolledCourse = {
  id: string;          // slug, e.g. "advanced-react-patterns"
  title: string;
  shortLabel: string;  // used in sidebar (max ~14 chars)
  tag: string;
  accent: string;      // oklch color string
  modules: CourseModule[];
};

const KEY = "synapse_enrolled_courses";

export function getEnrolled(): EnrolledCourse[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveEnrolled(courses: EnrolledCourse[]) {
  localStorage.setItem(KEY, JSON.stringify(courses));
}

export function isEnrolled(id: string): boolean {
  return getEnrolled().some((c) => c.id === id);
}

export function enrollCourse(course: EnrolledCourse) {
  const existing = getEnrolled();
  if (!existing.find((c) => c.id === course.id)) {
    saveEnrolled([...existing, course]);
  }
  // Dispatch a custom event so AppShell re-reads without a full reload
  window.dispatchEvent(new Event("synapse:enrollment-changed"));
}

export function removeCourse(id: string) {
  saveEnrolled(getEnrolled().filter((c) => c.id !== id));
  window.dispatchEvent(new Event("synapse:enrollment-changed"));
}
