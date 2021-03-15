use crate::errors::Error;
use crate::model::account::Role;
use async_graphql::async_trait;
use async_graphql::guard::Guard;
use async_graphql::Context;
use async_graphql::Result;

pub struct RoleGuard {
    pub role: Role,
}

#[async_trait::async_trait]
impl Guard for RoleGuard {
    async fn check(&self, ctx: &Context<'_>) -> Result<()> {
        let env = ctx.data::<crate::graphql::Context>()?;
        if env.has_role(self.role) {
            Ok(())
        } else {
            Err(Error::InsufficientPermissions.into())
        }
    }
}
