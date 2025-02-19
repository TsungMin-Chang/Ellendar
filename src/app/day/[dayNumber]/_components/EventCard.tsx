// this is a server side component
import { TiDelete } from "react-icons/ti";

import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { DbAffair } from "@/lib/types";
import { getTaipeiDate } from "@/lib/utils";

import { deleteEvent } from "./actions";

type EventCardProps = {
  events: DbAffair[];
  dayNumberInt: number;
  isHalfDay: boolean;
  accessToken: string;
};

export default function EventCard({
  events,
  dayNumberInt,
  isHalfDay,
  accessToken,
}: EventCardProps) {
  return (
    <>
      {events.map((event) => (
        <div
          key={event.id}
          className="flex flex-row items-center justify-between rounded-full bg-[#473520] p-2"
        >
          {/* edit dialog */}
          <div className="grow">
            <Link
              href={{
                pathname: `/day/${dayNumberInt}`,
                query: { editAffairId: event.id, isHalfDay, accessToken },
              }}
            >
              <div className="flex flex-row items-center justify-between">
                <div className="pl-2 text-zinc-200">{event.title}</div>
                <div className="flex items-center text-nowrap pr-2 text-sm text-zinc-200">
                  {getTaipeiDate(event.time1).getFullYear ===
                  new Date().getFullYear
                    ? getTaipeiDate(event.time1).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                      })
                    : getTaipeiDate(event.time1).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                  -{" "}
                  {getTaipeiDate(event.time2).getFullYear ===
                  new Date().getFullYear
                    ? getTaipeiDate(event.time2).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "numeric",
                      })
                    : getTaipeiDate(event.time2).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                </div>
              </div>
            </Link>
          </div>

          {/* delete */}
          <form
            className="flex"
            action={async () => {
              "use server";
              if (!accessToken) return;
              await deleteEvent(
                event.title,
                event.order,
                event.time1,
                event.time2,
                accessToken,
              );
              revalidatePath(`/day/${dayNumberInt}`);
              redirect(
                `/day/${dayNumberInt}/?isHalfDay=${isHalfDay}&accessToken=${accessToken}`,
              );
            }}
          >
            <button className="z-10 grow pl-1" type={"submit"}>
              <TiDelete color="gray" size={22} />
            </button>
          </form>
        </div>
      ))}
    </>
  );
}
