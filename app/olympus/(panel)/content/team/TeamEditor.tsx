"use client";

import { EyeOff } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { readStringList } from "@/collections/fields/stringList";
import type { TeamMember } from "@/payload-types";

import { saveTeamMember } from "../actions";
import {
  AddButton,
  DeleteButton,
  DetailDrawer,
  EditButton,
  EditModal,
  EditorShell,
  OpenDetail,
} from "../_components/EditorShell";
import { Area, DetailRow, Field } from "../_components/Fields";
import { ImageUpload } from "../_components/ImageUpload";
import { PillInput } from "../_components/PillInput";
import { SortableArea, SortableItem } from "../_components/Sortable";

/** Team members as a sortable list, in the order they appear on the site. */
export function TeamEditor({ members }: { members: TeamMember[] }) {
  return (
    <EditorShell<TeamMember>>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-muted">
          {members.length} people, shown in this order. Drag to rearrange.
        </p>
        <AddButton label="Add member" />
      </div>

      {members.length === 0 ? (
        <p className="rounded-[1.25rem] border border-dashed border-line px-4 py-10 text-center text-sm text-ink-muted">
          No team members yet.
        </p>
      ) : (
        <SortableArea items={members} collection="team-members" layout="list">
          {(member) => (
            <SortableItem key={member.id} id={member.id}>
              {(handle) => (
                <article className="flex items-center gap-2 rounded-[1.25rem] border border-line bg-panel p-3 transition-colors hover:border-line-strong">
                  {handle}

                  <img
                    src={member.photo}
                    alt=""
                    className="size-11 shrink-0 rounded-full border border-line object-cover"
                  />

                  <OpenDetail record={member} className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-semibold text-ink">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-ink-muted">
                      {member.role}
                    </p>
                    {!member.published && (
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-line bg-panel-strong px-2 py-0.5 text-[0.65rem] text-ink-muted">
                        <EyeOff className="size-3" aria-hidden />
                        Hidden
                      </span>
                    )}
                  </OpenDetail>

                  <div className="flex shrink-0 items-center gap-1">
                    <EditButton record={member} />
                    <DeleteButton
                      collection="team-members"
                      id={member.id}
                      name={member.name}
                    />
                  </div>
                </article>
              )}
            </SortableItem>
          )}
        </SortableArea>
      )}

      <DetailDrawer<TeamMember>
        title={(m) => m.name}
        render={(m) => (
          <>
            <img
              src={m.photo}
              alt=""
              className="mb-4 size-28 rounded-full border border-line object-cover"
            />
            <dl>
              <DetailRow label="Role" value={m.role} />
              <DetailRow label="Bio" value={m.bio} />
              <DetailRow
                label="Expertise"
                value={
                  <div className="flex flex-wrap gap-1.5">
                    {readStringList(m.expertise).map((e) => (
                      <span
                        key={e}
                        className="rounded-full border border-line bg-panel-strong px-2 py-0.5 text-xs"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                }
              />
              <DetailRow
                label="Published"
                value={m.published ? "Live" : "Hidden"}
              />
            </dl>
          </>
        )}
      />

      <EditModal<TeamMember>
        action={saveTeamMember}
        title={(m) => (m ? `Edit ${m.name}` : "New team member")}
        render={(m) => (
          <>
            <Field label="Name" name="name" defaultValue={m?.name} required />
            <Field label="Role" name="role" defaultValue={m?.role} required />
            <Area label="Bio" name="bio" defaultValue={m?.bio} rows={3} />
            <PillInput
              label="Expertise"
              name="expertise"
              defaultValues={readStringList(m?.expertise)}
              placeholder="Full-Stack Engineering, then Enter"
            />
            <ImageUpload
              label="Photo"
              name="photo"
              defaultValue={m?.photo}
              aspect="aspect-square"
              hint="Shown as a circle, so a square headshot works best."
            />
            <div className="sm:col-span-2">
              <Switch
                name="founder"
                label="Founder"
                defaultChecked={m ? Boolean(m.founder) : false}
                hint="Shows this person in the Founders block on /team and /about, instead of the team grid."
              />
            </div>
            <div className="sm:col-span-2">
              <Switch
                name="published"
                label="Published"
                defaultChecked={m ? Boolean(m.published) : true}
                hint="Turn off to hide from the site without deleting."
              />
            </div>
          </>
        )}
      />
    </EditorShell>
  );
}
