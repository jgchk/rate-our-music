use super::release_genre::ReleaseGenreMutation;
use async_graphql::*;

pub struct ReleaseMutation {
    pub id: i32,
}

#[Object]
impl ReleaseMutation {
    async fn genre(&self, id: i32) -> ReleaseGenreMutation {
        ReleaseGenreMutation {
            release_id: self.id,
            genre_id: id,
        }
    }
}
