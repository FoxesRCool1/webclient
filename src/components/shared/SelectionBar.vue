<template>
    <div v-if="!selection.isEmpty" class="selection-bar rounded no-select">
        <span class="count">{{ selection.count }} track{{ selection.count === 1 ? '' : 's' }} selected</span>

        <div class="actions">
            <button class="add-to-playlist" @click="showAddToPlaylist">Add to playlist</button>
            <button class="clear" @click="selection.clear()">Clear</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ContextSrc } from '@/enums'
import { Playlist } from '@/interfaces'
import { getAddToPlaylistOptions } from '@/context_menus/utils'
import { addTracksToPlaylist } from '@/requests/playlists'
import useContextStore from '@/stores/context'
import { Notification } from '@/stores/notification'
import useSelectionStore from '@/stores/selection'

const selection = useSelectionStore()
const context = useContextStore()

function addSelectedToPlaylist(playlist: Playlist) {
    const count = selection.count

    addTracksToPlaylist(playlist, selection.selected).then(success => {
        if (!success) return

        new Notification(`Added ${count} track${count === 1 ? '' : 's'} to ${playlist.name}`)
        selection.clear()
    })
}

function showAddToPlaylist(e: MouseEvent) {
    context.showContextMenu(e, () => getAddToPlaylistOptions(addSelectedToPlaylist), ContextSrc.Selection)
}
</script>

<style lang="scss">
.selection-bar {
    position: fixed;
    bottom: 6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1002;

    display: flex;
    align-items: center;
    gap: $large;

    padding: $small $small $small $medium;
    background-color: $gray;
    border: 1px solid $gray5;
    box-shadow: 0px 0px 2rem rgba(0, 0, 0, 0.6);

    .count {
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .actions {
        display: flex;
        gap: $small;
    }

    .clear {
        background-color: transparent;

        &:hover {
            background-color: $gray4;
        }
    }

    @include smallPhones {
        left: $small;
        right: $small;
        transform: none;
        justify-content: space-between;
    }
}
</style>
