using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Repository.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(BaseEntity).Assembly);

            modelBuilder.Entity<TicketPurchase>()
                .HasOne(x => x.User)
                .WithMany(x => x.TicketPurchases)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<TicketPurchase>()
                .HasOne(x => x.Product)
                .WithMany()
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RefundRequest>()
                .HasOne(x => x.User)
                .WithMany(x => x.RefundRequests)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<RefundRequest>()
                .HasOne(x => x.TicketPurchase)
                .WithMany()
                .HasForeignKey(x => x.TicketPurchaseId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public  DbSet<Slider> Sliders { get; set; }
        public  DbSet<Setting> Settings { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<SubCategory> SubCategories { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<Person> Persons { get; set; }

        public DbSet<Language> Languages { get; set; }
        public DbSet<ProductLanguage> ProductLanguages { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<NewsAuthor> NewsAuthors { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }
        public DbSet<Subscriber> Subscribers { get; set; }
        public DbSet<TicketPurchase> TicketPurchases { get; set; }
        public DbSet<RefundRequest> RefundRequests { get; set; }


    }
}
