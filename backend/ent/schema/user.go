package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"time"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").
			Unique().
			Immutable(),
		field.String("name").
			NotEmpty(),
		field.String("email").
			Unique().
			NotEmpty(),
		field.String("phone").
			Optional(),
		field.String("password_hash").
			Sensitive(),
		field.Int("age").
			Optional().
			Nillable().
			Positive(),
		field.String("experience_level").
			Default("beginner"),
		field.Float("rating").
			Default(0.0).
			Min(0).
			Max(5),
		field.Int("rating_count").
			Default(0).
			NonNegative(),
		field.String("driving_rating").
			Optional().
			Nillable(),
		field.String("profile_picture_url").
			Optional(),
		field.Bool("is_verified").
			Default(false),
		field.Bool("verified_id").
			Default(false),
		field.Bool("confirmed_email").
			Default(false),
		field.Bool("confirmed_phone").
			Default(false),
		field.Text("bio").
			Optional().
			Nillable(),
		field.JSON("preferences", map[string]interface{}{}).
			Optional(),
		field.String("membership_type").
			Default("non_professional"),
		field.Int("published_rides").
			Default(0).
			NonNegative(),
		field.Int("completed_rides").
			Default(0).
			NonNegative(),
		field.Bool("never_cancels").
			Default(true),
		field.Time("created_at").
			Default(time.Now).
			Immutable(),
		field.Time("updated_at").
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("rides", Ride.Type),
		edge.To("bookings", Booking.Type),
		edge.To("vehicles", Vehicle.Type),
	}
}
