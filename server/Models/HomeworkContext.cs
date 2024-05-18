﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace server.Models;

public partial class HomeworkContext : DbContext
{
    public HomeworkContext()
    {
    }

    public HomeworkContext(DbContextOptions<HomeworkContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Employee> Employees { get; set; }

//     protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
//         => optionsBuilder.UseSqlite();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Name);

            entity.ToTable("Employee");

            entity.Property(e => e.Name).HasColumnType("varchar(16)");
            entity.Property(e => e.Address).HasColumnType("varchar(64)");
            entity.Property(e => e.DateOfBirth)
                .HasDefaultValueSql("current_timestamp")
                .HasColumnType("date");
            entity.Property(e => e.Salary).HasColumnType("INT");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
