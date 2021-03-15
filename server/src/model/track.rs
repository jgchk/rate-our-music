use crate::model::artist::Artist;
use crate::model::release::Release;
use async_graphql::{Context, Object, Result};

pub struct Track {
    pub track_id: i32,
    pub release_id: i32,
    pub track_title: String,
    pub track_num: i16,
    pub track_duration_ms: Option<i32>,
}

#[Object]
impl Track {
    async fn id(&self) -> i32 {
        self.release_id
    }

    async fn release(&self, ctx: &Context<'_>) -> Result<Release> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let release = env.db().release().get_by_track(self.release_id).await?;
        Ok(release)
    }

    async fn title(&self) -> String {
        (&self.track_title).to_string()
    }

    async fn num(&self) -> i16 {
        self.track_num
    }

    async fn duration_ms(&self) -> Option<i32> {
        self.track_duration_ms
    }

    async fn artists(&self, ctx: &Context<'_>) -> Result<Vec<Artist>> {
        let env = ctx.data::<crate::graphql::Context>()?;
        let artists = env.db().artist().get_by_release(self.release_id).await?;
        Ok(artists)
    }
}
